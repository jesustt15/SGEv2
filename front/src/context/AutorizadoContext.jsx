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
    const [Autorizado, setAutorizado] = useState([]);
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

    const getAutorizados = async () => {
        try {
            const res = await getAutorizadosRequest();
            setAutorizado(res.data);
        } catch (error) {
            console.error("Error fetching Autorizado:", error);
        }
    };

    const createAutorizado = async (auto) => {
        try {
        //   const existingAutorizado = Autorizado.find(u => u.cedulaEscolar === est.get('cedulaEscolar'));
        //   if (existingAutorizado) {
        //     throw new Error('Este Autorizado ya existe.');
        //   }
          // Se asume que createAutorizadosRequest devuelve una respuesta con la data del Autorizado creado
          const res = await createAutorizadosRequest(auto);
          const createdAutorizado = res.data;  // Asegúrate de qurepree endpoint devuelve el objeto creado
      
          // Actualiza la lista de Autorizados
          getAutorizados();
      
          // Muestra el mensaje de éxito
          toast.current.show({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: 'Nuevo Autorizado agregado',
            life: 3000,
          });
      
          // Devuelve el Autorizado creado (o al menos su ID)
          
          return createdAutorizado;
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
            await updateAutorizadoRequest(id, autorizado);
            getAutorizados();
        } catch (error) {
            console.error("Error updating Autorizado:", error);
        }
    };

    const deleteAutorizado = async (id) => {
        try {
            const res = await deleteAutorizadoRequest(id);
            if (res.status === 204) setAutorizado(Autorizado.filter((Autorizado) => Autorizado.Autorizado_id !== id));
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
            Autorizado,
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