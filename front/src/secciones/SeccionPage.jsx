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
  const { setSeccion, getOneSeccion, seccion } = useSeccion();
  const { getEstudiantes, estudiante } = useEstudiante();
  const { personals, getPersonals } = usePersonal();

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    getPersonals();
    getEstudiantes();
  }, [getPersonals, getEstudiantes]);

  const docentes = personals.filter((perso) => perso.cargo === "Docente");

  useEffect(() => {
    const loadSeccion = async () => {
      if (id) {
        console.log('este es el id:', id);
        const fetchedSeccion = await getOneSeccion(id);
        setSeccion(fetchedSeccion);
        setFormInitialized(true);
      }
    };

    if (!formInitialized && id && Array.isArray(estudiante) && Array.isArray(docentes)) {
      loadSeccion();
    }
  }, [id, formInitialized, getOneSeccion, estudiante, docentes]);
  useEffect(() => {
    console.log("Objeto de Sección:", seccion);
    console.log("Lista de Estudiantes:", estudiante);
  }, [seccion, estudiante]);
  

  // Aquí se filtran únicamente los estudiantes que pertenecen a la sección actual.
  // Ajusta la propiedad 'seccion_id' según corresponda a la estructura de tus datos.
  const estudiantesFiltrados =
  Array.isArray(estudiante) && seccion
    ? estudiante.filter(est => String(est.seccion_id) === String(seccion.seccion_id))
    : [];


  return (
    <>
      <HeaderEdit />
      <div className="group">
        <div className="group-item">
          <label htmlFor="nombre">Sección</label>
          <h5>{seccion.seccion}</h5>
        </div>
        <div className="group-item">
          <label htmlFor="nivel">Nivel</label>
          <h5>{seccion.nivel}</h5>
        </div>
        <div className="group-item">
          <label htmlFor="nombre">Nombre del Nivel</label>
          <h5>{seccion.nombre}</h5>
        </div>
        <div className="group-item">
          <label htmlFor="docente">Docente</label>
          <h5>{getDocenteName(seccion.docente_id, personals)}</h5>
        </div>
      </div>
      <label>Lista de alumnos</label>
      <div className="estudiantes-table">
        <DataTable
          value={estudiantesFiltrados}
          paginator
          rows={10}
          emptyMessage="No se encontraron Estudiantes en esta sección."
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
