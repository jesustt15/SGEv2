/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import {  createSeccionRequest, deleteSeccionRequest, getOneSeccionRequest, getSeccionesRequest, updateSeccionRequest } from "../api";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';


const SeccionContext = createContext();

export const useSeccion = () => {
    const context = useContext(SeccionContext);
    if (!context) {
        throw new Error('useSeccion debe estar en el contexto');
    }
    return context;
};

export function SeccionProvider({ children }) {
    const [seccion, setSeccion] = useState([]);
    const [selectedSeccion, setSelectedSeccion] = useState(null);
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

    const getSecciones = async () => {
        try {
            const res = await getSeccionesRequest();
            setSeccion(res.data);
        } catch (error) {
            console.error("Error fetching Seccion:", error);
        }
    };

    const createSeccion = async (auto) => {
        try {
          const existingSeccion = seccion.find(u => u.nombre === auto.get('nombre'));
          if (existingSeccion) {
            throw new Error('Este Seccion ya existe.');
          }
          const res = await createSeccionRequest(auto); // Asegúrate de qurepree endpoint devuelve el objeto creado
      
          // Actualiza la lista de Seccions
          getSecciones();
      
          // Muestra el mensaje de éxito
          toast.current.show({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: 'Nueva Seccion agregada',
            life: 3000,
          });
          navigate('/secciones');
          return res;
        } catch (error) {
          console.error("Error creating Seccion:", error);
          if (error.response && error.response.data && error.response.data.errors) {
            throw error.response.data.errors;
          } else {
            throw [{ message: 'Error al crear Seccion' }];
          }
        }
      };
      
      const updateSeccion = async (id, seccion) => {
        try {
          const response = await updateSeccionRequest(id, seccion);
          getSecciones();
          navigate('/secciones');
          return response;
        } catch (error) {
          console.error("Error updating Seccion:", error);
        }
      };
      
      
    const deleteSeccion = async (id) => {
        try {
            const res = await deleteSeccionRequest(id);
            if (res.status === 204) setSeccion(seccion.filter((seccion) => seccion.seccion_id !== id));
            getSecciones();
        } catch (error) {
            console.error("Error deleting Seccion:", error);
        }
    };

    const getOneSeccion = async (id) => {
        try {
            const res = await getOneSeccionRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error fetching Seccion:", error);
        }
    };

    return (
        <SeccionContext.Provider value={{
            seccion,
            selectedSeccion,
            setSelectedSeccion,
            setSeccion,
            createSeccion,
            getSecciones,
            deleteSeccion,
            updateSeccion,
            getOneSeccion
        }}>
            {children}
            <Toast ref={toast} />
        </SeccionContext.Provider>
    );
}