// UsuariosList.jsx
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { ConfirmDialog} from 'primereact/confirmdialog';
import { useUsuario } from '../context';
import { NavLink } from 'react-router-dom';

export const Usuarios = () => {
  const { usuario, getUsuarios, selectedUsuario, setSelectedUsuario } = useUsuario();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.IN },
  });
  const toast = useRef(null);

  useEffect(() => {
    getUsuarios();
  }, []);

  const roles = [...new Set(usuario.map((user) => user.role))]; // Extrae roles únicos

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
      <>
        <div className="button-container">
          <NavLink className="p-button p-component" to="/usuarios/new">
            AÑADIR USUARIO
          </NavLink>
        </div>
        <div className="header-container">
          <div className="searcher">
            <InputText
              value={globalFilter}
              onChange={onGlobalFilterChange}
              placeholder="Buscar por nombre"
              className="search-bar"
            />
          </div>
          <div className="filters">
              <MultiSelect
                value={selectedRoles}
                options={roles}
                onChange={onRoleFilterChange}
                placeholder="Filtrar por Rol"
                display="chip"
              />
            </div>
        </div>
      </>
    );
  };

  const onRowSelect = (e) => {
    setSelectedUsuario(e.value);
  };

  return (
    <div className="estduiante-page">
      <div className="estudiantes-table">
        <Toast ref={toast} />
        <ConfirmDialog />
        <DataTable
            value={Array.isArray(usuario) ?usuario : []}
            paginator
            rows={10}
            header={renderHeader()}
            filters={filters}
            globalFilterFields={['nombres', 'apellidos']}
            emptyMessage="No se encontraronpersonals."
            selectionMode="single"
            selection={selectedUsuario}
            onSelectionChange={onRowSelect}
          >

            <Column field="username" header="Nombre de Usuario"  />
            <Column field="name" header="Nombre" />
            <Column field="role" header="Rol" />
        </DataTable>
      </div>
    </div>
  );
};