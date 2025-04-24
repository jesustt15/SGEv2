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
          const existingRepresentante = representante.find(u => u.ced === repre.get('ced'));
          if (existingRepresentante) {
            throw new Error('Este Representante ya existe.');
          }
          const existingPhone = representante.find(u => u.telf === repre.get('telf'));
          if (existingPhone) {
            throw new Error('Ya existe un Representante con este número de teléfono.');
          }
          const res = await createRepresentantesRequest(repre);
          const createdRepresentante = res.data;
      
          // Actualiza la lista de Representantes
          getRepresentantes();
      
          // Muestra el mensaje de éxito
          toast.current.show({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: 'Nuevo Representante agregado',
            life: 3000,
          });
      ;
          return createdRepresentante;
        } catch (error) {
          console.error("Error creating Representante:", error);
          if (error.response && error.response.data && error.response.data.errors) {
            throw error.response.data.errors;
          } else {
            throw [{ message: 'Error al crear Representante' }];
          }
        }
      };
      
      const updateRepresentante = async (id, representante) => {
        try {
          const existingRepresentante = representantes.find(u => u.ced === representante.get('ced'));
          if (existingRepresentante) {
            throw new Error('Este Representante ya existe.');
          }
          const existingPhone = representantes.find(u => u.telf === representante.get('telf'));
          if (existingPhone) {
            throw new Error('Ya existe un Representante con este número de teléfono.');
          }

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