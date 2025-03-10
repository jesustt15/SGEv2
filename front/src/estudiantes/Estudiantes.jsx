import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useEstudiante } from '../context';
import './estudiante.css';

export const Estudiantes = () => {
  {
    const { estudiante, getEstudiantes } = useEstudiante();
    const [globalFilter, setGlobalFilter] = useState(null);
    const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      role: { value: null, matchMode: FilterMatchMode.IN },
    });
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const toast = useRef(null);
  
    useEffect(() => {
      getEstudiantes();
    }, []);
  
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
      );
    };
  
    const onRowSelect = (e) => {
      setSelectedEstudiante(e.value);
    };
  
    return (
      <div className="estudiantes-page">
        {/* Columna izquierda: DataTable */}
        <div className="estudiantes-table">
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
            selectionMode="single"
            selection={selectedEstudiante}
            onSelectionChange={onRowSelect}
          >
            <Column field="cedulaEscolar" header="CED" sortable />
            <Column field="nombres" header="NOMBRES" sortable />
            <Column field="apellidos" header="APELLIDOS" sortable />
            <Column field="fechaNacimiento" header="FECHA DE NACIMIENTO" sortable />
            <Column field="edad" header="EDAD" sortable />
            <Column field="sexo" header="SEXO" sortable />
          </DataTable>
        </div>
      </div>   
  );
  }
};
