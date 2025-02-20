// UsuariosList.jsx
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useUsuario } from '../context';
import { EditUsuarioDialog } from './EditUsuarioDialog'; // Asegúrate de ajustar la ruta

export const Usuarios = () => {
  const { usuario, getUsuarios, deleteUsuario } = useUsuario();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
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
      <div className="table-header">
        <div className="p-grid">
          <div className="p-col-12 p-md-6">
            <h1>Gestión de Usuarios</h1>
          </div>
          <div className="p-col-12 p-md-3">
            <span className="p-input-icon-left">
              <i className="pi pi-search search-icon" />
              <InputText
                type="search"
                value={globalFilter}
                onChange={onGlobalFilterChange}
                placeholder="Buscar"
                className="search-input"
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

  // Función para renderizar los botones de acción
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          tooltip='Editar Usuario' tooltipOptions={{ position: 'mouse' }}
          onClick={() => editUsuario(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          tooltip='Eliminar Usuario' tooltipOptions={{ position: 'mouse' }}
          onClick={() => confirmDeleteUsuario(rowData)}
        />
      </>
    );
  };

  // Manejo de la edición
  const editUsuario = (user) => {
    setSelectedUsuario(user);
    setEditDialogVisible(true);
  };

  // Manejo de la eliminación
  const confirmDeleteUsuario = (usuario) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-danger',
      accept: () => deleteUsuarioById(usuario.user_id),
    });
  };

  const deleteUsuarioById = async (id) => {
    try {
      console.log('Deleting user with ID:', id);
      await deleteUsuario(id); // Asegúrate de tener esta función en tu contexto
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado', life: 3000 });
      getUsuarios(); // Actualiza la lista de usuarios
    } catch (error) {
      console.log(error)
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 3000 });
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />
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
        <Column header="Acciones" body={actionBodyTemplate} />
      </DataTable>

      {/* Componente para editar usuario */}
      {editDialogVisible && (
        <EditUsuarioDialog
          visible={editDialogVisible}
          onHide={() => setEditDialogVisible(false)}
          usuario={selectedUsuario}
          toast={toast}
          refreshUsuarios={getUsuarios}
        />
      )}
    </div>
  );
};
