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
          const existingAutorizado = autorizado.find(u => u.ced === auto.get('ced'));
          if (existingAutorizado) {
            throw new Error('Este Autorizado ya existe.');
          }
          const existingByTelf = autorizado.find(u => u.telf === auto.get('telf'));
          if (existingByTelf) {
            throw new Error('Este Autorizado ya existe.');
          }

          const res = await createAutorizadosRequest(auto);

      
          // Actualiza la lista de Autorizados
          getAutorizados();
      
          // Muestra el mensaje de éxito
          toast.current.show({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: 'Nuevo Autorizado agregado',
            life: 3000,
          });
      
          
          navigate('/estudiantes');
        } catch (error) {
          console.error("Error creating Autorizado:", error);
          if (error.response && error.response.data && error.response.data.errors) {
            throw error.response.data.errors;
          } else {
            throw [{ message: 'Error al crear Autorizado' }];
          }
        }
      };
      
    const updateAutorizado = async (id, autorizado) => {
      try {
        const cedula = autorizado.get('ced');
        const telf = autorizado.get('telf');
        const idString = String(id);

        const existingAutorizado = autorizados.find(u => String(u.id) !== idString && u.ced === cedula);;
        if (existingAutorizado) {
          throw new Error('Este Autorizado ya existe.');
        }
        const existingByTelf = autorizados.find(u => String(u.id) !== idString && u.telf === telf);
        if (existingByTelf) {
          throw new Error('Este Autorizado ya existe.');
        }

        const response = await updateAutorizadoRequest(id, autorizado);
        getAutorizados();
        return response; 
      } catch (error) {
        console.error("Error updating Autorizado:", error);
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