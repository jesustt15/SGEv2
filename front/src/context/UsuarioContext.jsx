/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import { createUsuariosRequest, deleteUsuarioRequest, getOneUsuarioRequest, getUsuariosRequest, updateUsuarioRequest } from "../api/usuarios";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';

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
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

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
                throw new Error('Usuario con este username ya existe.');
            }
            await createUsuariosRequest(user);
            getUsuarios();
            toast.current.show({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'Nuevo Usuario agregado',
                life: 3000,
              }); 
            navigate('/usuarios'); 
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
            console.log('context:', res.data);
            return res.data;
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    return (
        <UsuarioContext.Provider value={{
            usuario,
            selectedUsuario,
            setSelectedUsuario,
            createUsuario,
            getUsuarios,
            deleteUsuario,
            updateUsuario,
            getOneUsuario
        }}>
            {children}
            <Toast ref={toast} />
        </UsuarioContext.Provider>
    );
}