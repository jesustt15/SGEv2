/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { NavLink } from 'react-router-dom';
import '../estudiantes/estudiantes.css';
import { useEstudiante, usePersonal, useSeccion } from '../context';
import { getCantidadAlumnos, getDocenteName } from '../helpers';

export const Secciones = () => {

  const {seccion, getSecciones, setSelectedSeccion, selectedSeccion } = useSeccion();
  const {  getPersonals, personals } = usePersonal();         // Array de docentes
  const { estudiante, getEstudiantes } = useEstudiante();      // Array de estudiantes

  const [globalFilter, setGlobalFilter] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const toast = useRef(null);

  useEffect(() => {
    getSecciones();
    getPersonals();
    getEstudiantes();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const _filters = { ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } };
    setFilters(_filters);
    setGlobalFilter(value);
  };


  const docenteBodyTemplate = (rowData) => {
    return getDocenteName(rowData.docente_id, personals);
  };

  // Devuelve la cantidad de alumnos asignados a la sección
  const alumnosBodyTemplate = (rowData) => {
    // Filtra del listado de estudiantes aquellos que tienen este seccion_id
    return getCantidadAlumnos(rowData.seccion_id, estudiante);
  };

  const renderHeader = () => {
    return (
      <>
        <div className="button-container">
          <NavLink className="p-button p-component" to="/secciones/new">
            AÑADIR SECCION
          </NavLink>
        </div>
        <div className="header-container">
          <div className="searcher">
            <InputText
              value={globalFilter}
              onChange={onGlobalFilterChange}
              placeholder="Buscar por sección"
              className="search-bar"
            />
          </div>
        </div>
      </>
    );
  };

  const onRowSelect = (e) => {
    setSelectedSeccion(e.value);
  };

  return (
    <div className="estduiante-page">
      <div className="estudiantes-table">
        <Toast ref={toast} />
        <DataTable
            value={Array.isArray(seccion) ?seccion : []}
            paginator
            rows={10}
            header={renderHeader()}
            filters={filters}
            globalFilterFields={['seccion', 'niveles']}
            emptyMessage="No se encontraron Secciones."
            selectionMode="single"
            selection={selectedSeccion}
            onSelectionChange={onRowSelect}
          >

          <Column field="seccion" header="SECCIÓN" sortable />
          <Column field="nivel" header="NIVELES" sortable />
          <Column  header="DOCENTE" body={docenteBodyTemplate}  />
          <Column  body={alumnosBodyTemplate} header="ALUMNOS"  sortable/>
        </DataTable>
      </div>
    </div>
  );
};