/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useEstudiante, usePersonal, useSeccion } from '../context';
import { HeaderEdit } from '../components';
import {  getDocenteName, parseSeccionData } from '../helpers';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const SeccionPage = () => {
  const { id } = useParams();
  const { setSeccion, getOneSeccion,  seccion } = useSeccion();
  const { getEstudiantes, estudiante } = useEstudiante();
  const { personal, getPersonals } = usePersonal();

  // toastRef: usamos el que se pase por prop o el que define internament
  

  const [formInitialized, setFormInitialized] = useState(false);

  // Cargamos el listado completo desde los contextos
  useEffect(() => {
    getPersonals();
    getEstudiantes();
  }, [getPersonals, getEstudiantes]);

  const docentes = personal.filter((perso) => perso.cargo === "Docente");

  useEffect(() => {
    const loadSeccion = async () => {
      if (id) {
        console.log('este es el id:',id);
        const fetchedSeccion = await getOneSeccion(id);
        setSeccion(fetchedSeccion);
        // Primero parseamos la data (sin docente completo)
        let defaultValues = parseSeccionData(fetchedSeccion, estudiante);
        
        // Si se encontró el docente_id, buscamos el docente completo
        if (fetchedSeccion.docente_id) {
          const teacherFull = docentes.find(d => d.personal_id === fetchedSeccion.docente_id);
          if (teacherFull) {
            defaultValues.docente = teacherFull;
          }
        }
        setFormInitialized(true);
      }
    };
  
    if (!formInitialized && id && Array.isArray(estudiante) && Array.isArray(docentes)) {
      loadSeccion();
    }
  }, [id, formInitialized, getOneSeccion, estudiante, docentes]);
  
  return (
    <>
      <HeaderEdit />
        <div className="group">
            <div className="group-item">
                <label htmlFor="nombre">seccion</label>
                <h5>{seccion.seccion}</h5>
            </div>
            <div className="group-item">
                <label htmlFor="nivel">nivel</label>
                <h5>{seccion.nivel}</h5>
            </div>
            <div className="group-item">
                <label htmlFor="nombre">nombre del nivel</label>
                <h5>{seccion.nombre}</h5>
            </div>
           
            <div className="group-item">
                <label htmlFor="docente">docente</label>
                <h5>{getDocenteName(seccion.docente_id, personal)}</h5>
            </div>
        </div> 
        <label>Lista de alumnos</label>
        <div className="estudiantes-table">
            <DataTable
                value={Array.isArray(estudiante) ?estudiante : []}
                paginator
                rows={10}
                emptyMessage="No se encontraron Estudiantes en esta seccion."
                selectionMode="single"
                >
                <Column field="nombres" header="NOMBRES" />
                <Column field="apellidos" header="APELLIDOS" />
                <Column field="fechaNacimiento" header="FECHA DE NACIMIENTO" />
                <Column field="edad" header="EDAD" />
                <Column field="sexo" header="SEXO" />
            </DataTable>
        </div>
        
    </>
  );
};