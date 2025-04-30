/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { NavLink } from 'react-router-dom';
import '../estudiantes/estudiantes.css';
import { useAuth, usePersonal } from '../context';

export const Personal = () => {
  const {role} = useAuth();
  const { personals, getPersonals, setSelectedPersonal, selectedPersonal } = usePersonal();
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



  const renderHeader = () => {
    return (
      <>
        <div className="button-container">
        {role === 'admin' && (
            <NavLink className="p-button p-component" to="/personals/new">
            AÑADIR PERSONAL
          </NavLink>  
          )}
        </div>
        <div className="header-container">
          <div className="searcher">
            <InputText
              value={globalFilter}
              onChange={onGlobalFilterChange}
              placeholder="Buscar por nombre o apellido"
              className="search-bar"
            />
          </div>
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
        <DataTable
            value={Array.isArray(personals) ?personals : []}
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
