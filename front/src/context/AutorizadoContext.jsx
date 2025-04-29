/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import { createAutorizadosRequest, deleteAutorizadoRequest, getAutorizadosRequest, getOneAutorizadoRequest, updateAutorizadoRequest } from "../api";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';


const AutorizadoContext = createContext();

export const useAutorizado = () => {
    const context = useContext(AutorizadoContext);
    if (!context) {
        throw new Error('useAutorizado debe estar en el contexto');
    }
    return context;
};

export function AutorizadoProvider({ children }) {
    const [autorizado, setAutorizado] = useState([]);
    const [autorizados, setAutorizados] = useState([]); //estado para almacenar el array
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

    const getAutorizados = async () => {
        try {
            const res = await getAutorizadosRequest();
            setAutorizados(res.data);
        } catch (error) {
            console.error("Error fetching Autorizado:", error);
        }
    };

       const createAutorizado = async (auto) => {
         try {
           // Extrae los valores del FormData y normalízalos
           const cedulaCompletaFromForm = auto.get('ced');
           const telfFromForm = auto.get('telf');
     
           const normalizedCedula = cedulaCompletaFromForm?.trim().toLowerCase();
           const normalizedTelf = telfFromForm?.trim();
       
           const existingRepresentante = autorizados.find(u => {
             const storedCed = u.ced?.trim().toLowerCase();
             return storedCed === normalizedCedula;
           });
           if (existingRepresentante) {
             throw [{ field: 'ced', message: 'Este autorizado ya existe.' }];
           }
           
           const existingPhone = autorizados.find(u => u.telf?.trim() === normalizedTelf);
           if (existingPhone) {
             throw [{ field: 'telf', message: 'Este telf ya está registrado' }];
           }
           
           const res = await createAutorizadosRequest(auto);
           const createdRepresentante = res.data;
           
           getAutorizados();
   
           toast.current.show({
             severity: 'success',
             summary: 'Registro Exitoso',
             detail: 'Nuevo Autorizado agregado',
             life: 3000,
           });
           
           return createdRepresentante;
         } catch (error) {
           console.error("Error creating Autorizado", error);
           if (error.response && error.response.data && error.response.data.errors) {
             throw error.response.data.errors;
           } else if (Array.isArray(error)) {
             throw error;
           } else {
             throw [{ message: 'Error al crear Autorizado' }];
           }
         }
       };

       const updateAutorizado = async (id, autorizado) => {
        try {
          // Extraemos los valores enviados en el FormData
          
          // Convertimos id a string para la comparación

      
          // Validación de duplicados para cédula
        
      
          // Se procede a actualizar el autorizado utilizando la request correspondiente
          const response = await updateAutorizadoRequest(id, autorizado);
          
          // Actualizamos la lista de autorizados
          getAutorizados();
      
          return response;
        } catch (error) {
          console.error("[updateAutorizado] Error al actualizar Autorizado:", error);
          if (error.response && error.response.data && error.response.data.errors) {
            throw error.response.data.errors;
          } else if (Array.isArray(error)) {
            throw error;
          } else {
            throw [{ message: 'Error al actualizar autorizado' }];
          }
        }
      };
      
      
      
    const deleteAutorizado = async (id) => {
        try {
            const res = await deleteAutorizadoRequest(id);
            if (res.status === 204) setAutorizado(autorizado.filter((autorizado) => autorizado.autorizado_id !== id));
            getAutorizados();
        } catch (error) {
            console.error("Error deleting Autorizado:", error);
        }
    };

    const getOneAutorizado = async (id) => {
        try {
            const res = await getOneAutorizadoRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error fetching Autorizado:", error);
        }
    };

    return (
        <AutorizadoContext.Provider value={{
            autorizado,
            autorizados,
            createAutorizado,
            getAutorizados,
            deleteAutorizado,
            updateAutorizado,
            getOneAutorizado
        }}>
            {children}
            <Toast ref={toast} />
        </AutorizadoContext.Provider>
    );
}