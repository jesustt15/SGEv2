/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import { createPersonalsRequest, deletePersonalRequest, getPersonalsRequest, getOnePersonalRequest, updatePersonalRequest } from "../api";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';


const PersonalContext = createContext();

export const usePersonal = () => {
    const context = useContext(PersonalContext);
    if (!context) {
        throw new Error('usePersonal debe estar en el contexto');
    }
    return context;
};

export function PersonalProvider({ children }) {
    const [personal, setPersonal] = useState([]);
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

    const getPersonals = async () => {
        try {
            const res = await getPersonalsRequest();
            setPersonal(res.data);
        } catch (error) {
            console.error("Error fetching Personal:", error);
        }
    };

    const createPersonal = async (auto) => {
        try {
        //   const existingPersonal = Personal.find(u => u.cedulaEscolar === est.get('cedulaEscolar'));
        //   if (existingPersonal) {
        //     throw new Error('Este Personal ya existe.');
        //   }
          // Se asume que createPersonalsRequest devuelve una respuesta con la data del Personal creado
          const res = await createPersonalsRequest(auto);
          const createdPersonal = res.data;  // Asegúrate de qurepree endpoint devuelve el objeto creado
      
          // Actualiza la lista de Personals
          getPersonals();
      
          // Muestra el mensaje de éxito
          toast.current.show({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: 'Nuevo Personal agregado',
            life: 3000,
          });
      
          // Devuelve el Personal creado (o al menos su ID)
          
          return createdPersonal;
          navigate('/personals');
        } catch (error) {
          console.error("Error creating Personal:", error);
          if (error.response && error.response.data && error.response.data.errors) {
            throw error.response.data.errors;
          } else {
            throw [{ message: 'Error al crear Personal' }];
          }
        }
      };
      
      const updatePersonal = async (id, personal) => {
        try {
            console.log('context:',personal, id)
          const response = await updatePersonalRequest(id, personal);
          getPersonals();
          return response; 
        } catch (error) {
          console.error("Error updating Personal:", error);
        }
      };
      
      
    const deletePersonal = async (id) => {
        try {
            const res = await deletePersonalRequest(id);
            if (res.status === 204) setPersonal(personal.filter((personal) => personal.personal_id !== id));
            getPersonals();
        } catch (error) {
            console.error("Error deleting Personal:", error);
        }
    };

    const getOnePersonal = async (id) => {
        try {
            const res = await getOnePersonalRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error fetching Personal:", error);
        }
    };

    return (
        <PersonalContext.Provider value={{
            personal,
            createPersonal,
            getPersonals,
            deletePersonal,
            updatePersonal,
            getOnePersonal
        }}>
            {children}
            <Toast ref={toast} />
        </PersonalContext.Provider>
    );
}