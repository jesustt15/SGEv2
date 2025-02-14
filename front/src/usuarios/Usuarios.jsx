import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode } from 'primereact/api';
import { useUsuario } from '../context';

export const Usuarios = () => {
  const { usuario, getUsuarios } = useUsuario();

  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'role': { value: null, matchMode: FilterMatchMode.IN }
  });

  useEffect(() => {
    getUsuarios();
  }, []);

  const roles = [...new Set(usuario.map(user => user.role))]; // Extrae roles únicos

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilter(value);
  };

  const onRoleFilterChange = (e) => {
    const value = e.value;
    let _filters = { ...filters };
    _filters['role'].value = value;

    setFilters(_filters);
    setSelectedRoles(value);
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <div className="p-grid">
          <div className="p-col-12 p-md-6">
            <h1>Gestión de Usuarios</h1>
          </div>
          <div className="p-col-13 p-md-3">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                value={globalFilter}
                onChange={onGlobalFilterChange}
                placeholder="Buscar"
              />
            </span>
          </div>
          <div className="p-col-12 p-md-3">
            <MultiSelect
              value={selectedRoles}
              options={roles}
              onChange={onRoleFilterChange}
              placeholder="Filtrar por Rol"
              display="chip"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <DataTable
        value={usuario}
        paginator
        rows={10}
        header={renderHeader()}
        filters={filters}
        globalFilterFields={['name', 'username']}
        emptyMessage="No se encontraron usuarios."
      >
        <Column field="username" header="Nombre de Usuario" sortable />
        <Column field="name" header="Nombre" sortable />
        <Column field="role" header="Rol" sortable />
      </DataTable>
    </div>
  );
};
