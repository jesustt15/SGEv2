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
    const [personals, setPersonals] = useState([]); //estado para almacenar el array
    const [selectedPersonal, setSelectedPersonal] = useState(null);
    const toast = useRef(null); // Referencia para el Toast
    const navigate = useNavigate();

    const getPersonals = useCallback(async () => {
      try {
        const res = await getPersonalsRequest();
        setPersonals(res.data);
      } catch (error) {
        console.error("Error fetching Personal:", error);
      }
    }, []);

    const createPersonal = async (auto) => {
        try {
          const existingPersonal = personals.find(u => u.ced === auto.get('ced'));
          if (existingPersonal) {
            throw new Error('Este Personal ya existe con esa cedula.');
          }
          const existingByCod = personals.find(u => u.cod === auto.get('cod'));
          if (existingByCod) {
            throw new Error('Ya existe un personal con ese código.');
          }

          const existingByTelf = personals.find(u => u.telf === auto.get('telf'));
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
      
      const updatePersonal = async (id, newPersonal) => {
        try {
          const cedula = newPersonal.get('ced');
          const cod = newPersonal.get('cod');
          const telf = newPersonal.get('telf');
      
          // Convirtiendo el id a string para garantizar la comparación
          const idString = String(id);
      
          // Excluimos el registro propio convirtiendo también el id del objeto a string
          const existingPersonal = personals.find(u => String(u.id) !== idString && u.ced === cedula);
          if (existingPersonal) {
            throw new Error('Este Personal ya existe con esa cédula.');
          }
          const existingByCod = personals.find(u => String(u.id) !== idString && u.cod === cod);
          if (existingByCod) {
            throw new Error('Ya existe un personal con ese código.');
          }
          const existingByTelf = personals.find(u => String(u.id) !== idString && u.telf === telf);
          if (existingByTelf) {
            throw new Error('Ya existe un personal con ese teléfono.');
          }
      
          const response = await updatePersonalRequest(id, newPersonal);
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
            personals,
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