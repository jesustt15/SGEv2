/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import { createRepresentantesRequest, deleteRepresentanteRequest, getRepresentantesRequest, getOneRepresentanteRequest, updateRepresentanteRequest } from "../api";
import { Toast } from 'primereact/toast';


const RepresentanteContext = createContext();

export const useRepresentante = () => {
    const context = useContext(RepresentanteContext);
    if (!context) {
        throw new Error('useRepresentante debe estar en el contexto');
    }
    return context;
};

export function RepresentanteProvider({ children }) {
    const [representante, setRepresentante] = useState([]);
    const [representantes, setRepresentantes] = useState([]); // Cambié el nombre de la variable a "representantes" para evitar confusiones
    const toast = useRef(null); // Referencia para el Toast


    const getRepresentantes = async () => {
        try {
            const res = await getRepresentantesRequest();
            setRepresentantes(res.data);
        } catch (error) {
            console.error("Error fetching Representante:", error);
        }
    };

    const createRepresentante = async (repre) => {
      try {
        // Extrae los valores del FormData y normalízalos
        const cedulaCompletaFromForm = repre.get('ced');
        const telfFromForm = repre.get('telf');
  
        const normalizedCedula = cedulaCompletaFromForm?.trim().toLowerCase();
        const normalizedTelf = telfFromForm?.trim();
    
        const existingRepresentante = representantes.find(u => {
          const storedCed = u.ced?.trim().toLowerCase();
          return storedCed === normalizedCedula;
        });
        if (existingRepresentante) {
          throw [{ field: 'ced', message: 'Este representante ya existe.' }];
        }
        
        const existingPhone = representantes.find(u => u.telf?.trim() === normalizedTelf);
        if (existingPhone) {
          throw [{ field: 'telf', message: 'Este telf ya está registrado' }];
        }
        
        const res = await createRepresentantesRequest(repre);
        const createdRepresentante = res.data;
        
        getRepresentantes();

        toast.current.show({
          severity: 'success',
          summary: 'Registro Exitoso',
          detail: 'Nuevo Representante agregado',
          life: 3000,
        });
        
        return createdRepresentante;
      } catch (error) {
        console.error("Error creating representante", error);
        if (error.response && error.response.data && error.response.data.errors) {
          throw error.response.data.errors;
        } else if (Array.isArray(error)) {
          throw error;
        } else {
          throw [{ message: 'Error al crear representante' }];
        }
      }
    };
    
      
      const updateRepresentante = async (id, representante) => {
        try {

          await updateRepresentanteRequest(id, representante);

          getRepresentantes();
        } catch (error) {
          console.error("Error updating Representante:", error);
        }
      };
      

    const deleteRepresentante = async (id) => {
        try {
            const res = await deleteRepresentanteRequest(id);
            if (res.status === 204) setRepresentante(representante.filter((representante) => representante.representante_id !== id));
            getRepresentantes();
        } catch (error) {
            console.error("Error deleting Representante:", error);
        }
    };

    const getOneRepresentante = async (id) => {
        try {
            const res = await getOneRepresentanteRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error fetching Representante:", error);
        }
    };

    return (
        <RepresentanteContext.Provider value={{
            representante,
            representantes,
            createRepresentante,
            getRepresentantes,
            deleteRepresentante,
            updateRepresentante,
            getOneRepresentante
        }}>
            {children}
            <Toast ref={toast} />
        </RepresentanteContext.Provider>
    );
}