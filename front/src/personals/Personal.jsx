
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
import { usePersonal } from '../context';

export const Personal = () => {
  const {personal, getPersonals, setSelectedPersonal, selectedPersonal } = usePersonal();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sexo: { value: null, matchMode: FilterMatchMode.EQUALS },
    edad: { value: null, matchMode: FilterMatchMode.EQUALS },
    condicion: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const toast = useRef(null);

  useEffect(() => {
    getPersonals();
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

  const renderHeader = () => {
    return (
      <>
        <div className="button-container">
          <NavLink className="p-button p-component" to="/personals/new">
            AÑADIR PERSONAL
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
    setSelectedPersonal(e.value);
  };

  return (
    <div className="estduiante-page">
      <div className="estudiantes-table">
        <Toast ref={toast} />
        <ConfirmDialog />
        <DataTable
            value={Array.isArray(personal) ?personal : []}
            paginator
            rows={10}
            header={renderHeader()}
            filters={filters}
            globalFilterFields={['nombres', 'apellidos']}
            emptyMessage="No se encontraronpersonals."
            selectionMode="single"
            selection={selectedPersonal}
            onSelectionChange={onRowSelect}
          >

          <Column field="nombres" header="NOMBRES" sortable />
          <Column field="apellidos" header="APELLIDOS" sortable />
          <Column field="ced" header="CED" sortable />
          <Column field="cod" header="COD" />
          <Column field="telf" header="TELF" />
        </DataTable>
      </div>
    </div>
  );
};
