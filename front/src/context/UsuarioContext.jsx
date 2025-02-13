/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import {  } from '../api';
import { createUsuariosRequest, deleteUsuarioRequest, getOneUsuarioRequest, getUsuariosRequest, updateUsuarioRequest } from "../api/usuarios";

const UsuarioContext = createContext();

export const useUsuario = () => {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error('useUsuario debe estar en el contexto');
    }
    return context;
};

export function UsuarioProvider({ children }) {
    const [usuario, setUsuario] = useState([]);

    const getUsuarios = async () => {
        try {
            const res = await getUsuariosRequest();
            setUsuario(res.data);
        } catch (error) {
            console.error("Error fetching usuario:", error);
        }
    };

    const createUsuario = async (user) => {
        try {
            const existingUser = usuario.find(u => u.username === user.username);
            if (existingUser) {
                throw new Error('User with this email already exists.');
            }
            await createUsuariosRequest(user);
            getUsuarios(); // Refresh the user list
        } catch (error) {
            console.error("Error creating user:", error);
            throw error; // Re-throw the error to be caught in the component
        }
    };

    const updateUsuario = async (id, user) => {
        try {
            await updateUsuarioRequest(id, user);
            getUsuarios();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const deleteUsuario = async (id) => {
        try {
            const res = await deleteUsuarioRequest(id);
            if (res.status === 204) setUsuario(usuario.filter((user) => user._id !== id));
            getUsuarios();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const getOneUsuario = async (id) => {
        try {
            const res = await getOneUsuarioRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    return (
        <UsuarioContext.Provider value={{
            usuario,
            createUsuario,
            getUsuarios,
            deleteUsuario,
            updateUsuario,
            getOneUsuario
        }}>
            {children}
        </UsuarioContext.Provider>
    );
}