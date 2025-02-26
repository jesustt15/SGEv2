import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { EditEstudianteDialog } from './EditEstudianteDialog'; // Asegúrate de ajustar la ruta
import { useEstudiante } from '../context';

export const Estudiantes = () => {
  const { estudiante, getEstudiantes, deleteEstudiante } = useEstudiante();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    getEstudiantes();
  }, []);

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`http://localhost:8000/${rowData.foto}`}
        alt={rowData.nombres}
        className="w-6rem shadow-2 border-round"
      />
    );
  };
  


  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilter(value);
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <div className="p-grid">
          <div className="p-col-12 p-md-6">
            <h1>Gestión de Estudiantes</h1>
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
          tooltip='Editar Estudiante' tooltipOptions={{ position: 'mouse' }}
          onClick={() => editEstudiante(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          tooltip='Eliminar Estudiante' tooltipOptions={{ position: 'mouse' }}
          onClick={() => confirmDeleteEstudiante(rowData)}
        />
      </>
    );
  };

  // Manejo de la edición
  const editEstudiante = (est) => {
    setSelectedEstudiante(est);
    setEditDialogVisible(true);
  };

  // Manejo de la eliminación
  const confirmDeleteEstudiante = (estudiante) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este Estudiante?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-danger',
      accept: () => deleteEstudianteById(estudiante.estudiante_id),
    });
  };

  const deleteEstudianteById = async (id) => {
    try {
      console.log('Deleting user with ID:', id);
      await deleteEstudiante(id); // Asegúrate de tener esta función en tu contexto
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Estudiante eliminado', life: 3000 });
      getEstudiantes(); // Actualiza la lista de Estudiantes
    } catch (error) {
      console.log(error)
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Estudiante', life: 3000 });
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />
      <DataTable
        value={estudiante}
        paginator
        rows={10}
        header={renderHeader()}
        filters={filters}
        globalFilterFields={['nombres', 'apellidos']}
        emptyMessage="No se encontraron Estudiantes."
      >

        <Column field="cedulaEscolar" header="CED" sortable />
        <Column field="nombres" header="Nombres" sortable />
        <Column field="apellidos" header="Apellidos" sortable />
        <Column field="fechaNacimiento" header="Fecha de Nac:" sortable />
        <Column field="lugarNacimiento" header="Lugar de Nac:" sortable />
        <Column field="edad" header="Edad" sortable />
        <Column field="sexo" header="Sexo" sortable />
        <Column header="Foto" body={imageBodyTemplate} sortable />
        <Column header="Acciones" body={actionBodyTemplate} />
      </DataTable>

      {/* Componente para editar Estudiante */}
      {editDialogVisible && (
        <EditEstudianteDialog
          visible={editDialogVisible}
          onHide={() => setEditDialogVisible(false)}
          Estudiante={selectedEstudiante}
          toast={toast}
          refreshEstudiantes={getEstudiantes}
        />
      )}
    </div>
  );
};
