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
          const cedulaFromForm = auto.get('ced');
          const codFromForm = auto.get('cod');
          const telfFromForm = auto.get('telf');

          const existingPersonal = personals.find(u => u.ced === cedulaFromForm);
          if (existingPersonal) {
            throw [{ field: 'ced', message: 'Este Personal ya existe.' }];
          }
          const existingByCod = personals.find(u => u.cod === codFromForm);
          if (existingByCod) {
            throw [{field: 'cod', message: 'Ya existe un personal con ese código.'}];
          }

          const existingByTelf = personals.find(u => u.telf === telfFromForm);
          if (existingByTelf) {
            throw [{field: 'telf', message: 'Ya existe un personal con ese telf.'}];
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
          } else if (Array.isArray(error)) {
              throw error;
          }
          else {
              throw [{ message: 'Error al crear personal' }];
          }
      }
      };
      
      const updatePersonal = async (id, newPersonal) => {
        try {
          const cedula = newPersonal.get('ced');
          const cod = newPersonal.get('cod');
          const telf = newPersonal.get('telf');
      

          const idString = String(id);
      
          const existingPersonal = personals.find(u => String(u.id) !== idString && u.ced === cedula);
          if (existingPersonal) {
            throw [{ field: 'ced', message: 'Este Personal ya existe.' }];
          }
          const existingByCod = personals.find(u => String(u.id) !== idString && u.cod === cod);
          if (existingByCod) {
            throw [{field: 'cod', message: 'Ya existe un personal con ese código.'}];
          }
          const existingByTelf = personals.find(u => String(u.id) !== idString && u.telf === telf);
          if (existingByTelf) {
            throw [{field: 'telf', message: 'Ya existe un personal con ese telf.'}];
          }
      
          const response = await updatePersonalRequest(id, newPersonal);
          getPersonals();
          navigate('/personals');
          return response;
        } catch (error) {
          console.error("Error creating Personal:", error);
          if (error.response && error.response.data && error.response.data.errors) {
              throw error.response.data.errors;
          } else if (Array.isArray(error)) {
              throw error;
          }
          else {
              throw [{ message: 'Error al crear personal' }];
          }
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