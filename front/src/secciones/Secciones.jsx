
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { NavLink } from 'react-router-dom';
import '../estudiantes/estudiantes.css';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { useEstudiante, usePersonal, useSeccion } from '../context';
import { getCantidadAlumnos, getDocenteName } from '../helpers';

export const Secciones = () => {

  const {seccion, getSecciones, setSelectedSeccion, selectedSeccion } = useSeccion();
  const { personal, getPersonals } = usePersonal();         // Array de docentes
  const { estudiante, getEstudiantes } = useEstudiante();      // Array de estudiantes

  const [globalFilter, setGlobalFilter] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sexo: { value: null, matchMode: FilterMatchMode.EQUALS },
    edad: { value: null, matchMode: FilterMatchMode.EQUALS },
    condicion: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  // Reiniciar los filtros
  const resetFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      sexo: { value: null, matchMode: FilterMatchMode.EQUALS },
      edad: { value: null, matchMode: FilterMatchMode.EQUALS },
      condicion: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilter(null);
  };

  // Opciones para filtro de sexo
  const sexOptions = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
  ];

  const onSexoFilterChange = (e) => {
    const value = e.value;
    const _filters = {
      ...filters,
      sexo: { value, matchMode: FilterMatchMode.EQUALS },
    };
    setFilters(_filters);
  };

  const edadOptions = [
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ];
  const onEdadFilterChange = (e) => {
    const value = e.value;
    const _filters = {
      ...filters,
      edad: { value, matchMode: FilterMatchMode.EQUALS },
    };
    setFilters(_filters);
  };

  const condicionOptions = [
    { label: 'Si', value: 'si' },
    { label: 'No', value: 'no' },
  ];

  const onCondicionFilterChange = (e) => {
    const value = e.value;
    const _filters = {
      ...filters,
      condicion: { value, matchMode: FilterMatchMode.CONTAINS },
    };
    setFilters(_filters);
  };

  const docenteBodyTemplate = (rowData) => {
    return getDocenteName(rowData.docente_id, personal);
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
              placeholder="Buscar"
              className="search-bar"
            />
          </div>
          <div className="filters">
            <MultiSelect
              value={filters.sexo.value}
              options={sexOptions}
              onChange={onSexoFilterChange}
              placeholder="Sexo"
            />
            <MultiSelect
              value={filters.edad.value}
              options={edadOptions}
              onChange={onEdadFilterChange}
              placeholder="Edad"
            />
            <MultiSelect
              value={filters.condicion.value}
              options={condicionOptions}
              onChange={onCondicionFilterChange}
              placeholder="Condicion"
            />
          </div>
          {/* Botón para reiniciar filtros */}
          <Button
            label="Limpiar filtros"
            icon="pi pi-filter-slash"
            onClick={resetFilters}
            className="p-button-secondary"
          />
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
        <ConfirmDialog />
        <DataTable
            value={Array.isArray(seccion) ?seccion : []}
            paginator
            rows={10}
            header={renderHeader()}
            filters={filters}
            globalFilterFields={['seccion', 'niveles']}
            emptyMessage="No se encontraronpersonals."
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