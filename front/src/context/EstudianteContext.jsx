/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import { createEstudiantesRequest, deleteEstudianteRequest, getEstudiantesRequest, getOneEstudianteRequest, updateEstudianteRequest } from "../api";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';


const EstudianteContext = createContext();

export const useEstudiante = () => {
    const context = useContext(EstudianteContext);
    if (!context) {
        throw new Error('useEstudiante debe estar en el contexto');
    }
    return context;
};

export function EstudianteProvider({ children }) {
    const [estudiante, setEstudiante] = useState([]);
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

    const getEstudiantes = async () => {
        try {
            const res = await getEstudiantesRequest();
            setEstudiante(res.data);
        } catch (error) {
            console.error("Error fetching Estudiante:", error);
        }
    };

    const createEstudiante = async (est) => {
        try {
            const existingestudiante = estudiante.find(u => u.cedulaEscolar === est.cedulaEscolar);
            if (existingestudiante) {
                throw new Error('este Estudiante ya existe.');
            }
            await createEstudiantesRequest(est);
            getEstudiantes();
            toast.current.show({
                severity: 'success',
                summary: 'Registro Exitoso',
                detail: 'Nuevo Estudiante agregado',
                life: 3000,
              }); 
            navigate('/estudiantes'); 
        } catch (error) {
            console.error("Error creating estudiante:", error);
            throw error; // Re-throw the error to be caught in the component
        }
    };

    const updateEstudiante = async (id, estudiante) => {
        try {
            await updateEstudianteRequest(id, estudiante);
            getEstudiantes();
        } catch (error) {
            console.error("Error updating estudiante:", error);
        }
    };

    const deleteEstudiante = async (id) => {
        try {
            const res = await deleteEstudianteRequest(id);
            if (res.status === 204) setEstudiante(estudiante.filter((estudiante) => estudiante.estudiante_id !== id));
            getEstudiantes();
        } catch (error) {
            console.error("Error deleting estudiante:", error);
        }
    };

    const getOneEstudiante = async (id) => {
        try {
            const res = await getOneEstudianteRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error fetching estudiante:", error);
        }
    };

    return (
        <EstudianteContext.Provider value={{
            estudiante,
            createEstudiante,
            getEstudiantes,
            deleteEstudiante,
            updateEstudiante,
            getOneEstudiante
        }}>
            {children}
            <Toast ref={toast} />
        </EstudianteContext.Provider>
    );
}