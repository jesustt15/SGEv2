/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useCallback, useContext, useRef, useState } from "react";
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
    const [selectedPersonal, setSelectedPersonal] = useState(null);
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

    const getPersonals = useCallback(async () => {
      try {
        const res = await getPersonalsRequest();
        setPersonal(res.data);
      } catch (error) {
        console.error("Error fetching Personal:", error);
      }
    }, []);

    const createPersonal = async (auto) => {
        try {
          const existingPersonal = personal.find(u => u.ced === auto.get('ced'));
          if (existingPersonal) {
            throw new Error('Este Personal ya existe con esa cedula.');
          }
          const existingByCod = personal.find(u => u.cod === auto.get('cod'));
          if (existingByCod) {
            throw new Error('Ya existe un personal con ese código.');
          }

          const existingByTelf = personal.find(u => u.telf === auto.get('telf'));
          if (existingByTelf) {
            throw new Error('Ya existe un personal con ese teléfono.');
}

         await createPersonalsRequest(auto);
      
          // Actualiza la lista de Personals
          getPersonals();
      
          // Muestra el mensaje de éxito
          toast.current.show({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: 'Nuevo Personal agregado',
            life: 3000,
          });
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
          const existingPersonal = personal.find(u => u.ced === personal.get('ced'));
          if (existingPersonal) {
            throw new Error('Este Personal ya existe con esa cedula.');
          }
          const existingByCod = personal.find(u => u.cod === personal.get('cod'));
          if (existingByCod) {
            throw new Error('Ya existe un personal con ese código.');
          }

          const existingByTelf = personal.find(u => u.telf === personal.get('telf'));
          if (existingByTelf) {
            throw new Error('Ya existe un personal con ese teléfono.');
          }

          const response = await updatePersonalRequest(id, personal);
          getPersonals();
          navigate('/personals');
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
            selectedPersonal,
            setSelectedPersonal,
            setPersonal,
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