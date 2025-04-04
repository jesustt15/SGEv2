/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import { createEstudiantesRequest, deleteEstudianteRequest, getEstudiantesRequest, getOneEstudianteRequest, updateEstudianteRequest } from "../api";
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";


const EstudianteContext = createContext();

export const useEstudiante = () => {
    const context = useContext(EstudianteContext);
    if (!context) {
        throw new Error('useEstudiante debe estar en el contexto');
    }
    return context;
};

export function EstudianteProvider({ children }) {
    const [estudiante, setEstudiante] = useState([]);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const navigate = useNavigate();
    const toast = useRef(null); // Referencia para el Toast

    const getEstudiantes = async () => {
        try {
          const res = await getEstudiantesRequest();
          setEstudiante(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
          console.error("Error fetching Estudiante:", error);
        }
      };
      

    const createEstudiante = async (est) => {
        try {
          const existingEstudiante = estudiante.find(u => u.cedulaEscolar === est.get('cedulaEscolar'));
          if (existingEstudiante) {
            throw new Error('Este estudiante ya existe.');
          }
        
          const res = await createEstudiantesRequest(est);
          const createdEstudiante = res.data;  // Asegúrate de que este endpoint devuelve el objeto creado
      
          getEstudiantes();
      
          toast.current.show({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: 'Nuevo Estudiante agregado',
            life: 3000,
          });
      

          return createdEstudiante;
        } catch (error) {
          console.error("Error creating estudiante:", error);
          if (error.response && error.response.data && error.response.data.errors) {
            throw error.response.data.errors;
          } else {
            throw [{ message: 'Error al crear estudiante' }];
          }
        }
      };
      
    const updateEstudiante = async (id, estudiante) => {
        try {

            await updateEstudianteRequest(id, estudiante);
            getEstudiantes();
           
            toast.current.show({
                severity: 'success',
                summary: 'Actualización Exitosa',
                detail: 'Estudiante actualizado',
                life: 2000,
              });

            navigate('/estudiantes');
        } catch (error) {
            console.error("Error updating estudiante:", error);
        }
    };

    const deleteEstudiante = async (id) => {
        try {
            const res = await deleteEstudianteRequest(id);
            if (res.status === 204) setEstudiante(estudiante.filter((estudiante) => estudiante.estudiante_id !== id));
            getEstudiantes();
        } catch (error) {
            console.error("Error deleting estudiante:", error);
        }
    };

    const getOneEstudiante = async (id) => {
        try {
            const res = await getOneEstudianteRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error fetching estudiante:", error);
        }
    };

    return (
        <EstudianteContext.Provider value={{
            estudiante,
            selectedEstudiante,
            setEstudiante,
            setSelectedEstudiante,
            createEstudiante,
            getEstudiantes,
            deleteEstudiante,
            updateEstudiante,
            getOneEstudiante
        }}>
            {children}
            <Toast ref={toast} />
        </EstudianteContext.Provider>
    );
}