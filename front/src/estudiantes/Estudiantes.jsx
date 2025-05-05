import { useState, useEffect, useRef, useMemo } from 'react'; // Import React
import { NavLink } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown'; // Use Dropdown consistently
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { useEstudiante, useAuth } from '../context';
import './estudiantes.css';
// Remove MultiSelect import if no longer needed
// import { MultiSelect } from 'primereact/multiselect';

export const Estudiantes = () => {
    const { role } = useAuth();
    const { estudiante, getEstudiantes, setSelectedEstudiante, selectedEstudiante } = useEstudiante();
    const [globalFilter, setGlobalFilter] = useState(''); // Initialize as string
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sexo: { value: null, matchMode: FilterMatchMode.EQUALS },
        edad: { value: null, matchMode: FilterMatchMode.EQUALS },
        // CONDICION IS HANDLED MANUALLY, removed from here
    });
    const [condicionFilterValue, setCondicionFilterValue] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        getEstudiantes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || '';
        const _filters = { ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } };
        setFilters(_filters);
        setGlobalFilter(value); // Keep separate state for global filter input value
    };

    // Reiniciar los filtros
    const resetFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            sexo: { value: null, matchMode: FilterMatchMode.EQUALS },
            edad: { value: null, matchMode: FilterMatchMode.EQUALS },
            // No need to reset condicion here, it's separate
        });
        setGlobalFilter('');
        setCondicionFilterValue(null); // Reset the custom filter state
    };

    // --- Options and Handlers for Standard Filters (using Dropdown) ---
    const sexOptions = [
        { label: 'Sexo: Todos', value: null },
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' },
    ];

    const onSexoFilterChange = (e) => {
        const value = e.value;
        // Update the main filters state for DataTable internal filtering
        setFilters(prevFilters => ({
             ...prevFilters,
             sexo: { value: value, matchMode: FilterMatchMode.EQUALS }
        }));
    };

    const edadOptions = [
        { label: 'Edad: Todas', value: null },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
    ];
    const onEdadFilterChange = (e) => {
        const value = e.value;
         // Update the main filters state for DataTable internal filtering
        setFilters(prevFilters => ({
            ...prevFilters,
            edad: { value: value, matchMode: FilterMatchMode.EQUALS }
        }));
    };

    // --- Options and Handler for Custom Condicion Filter ---
    const condicionOptions = [
        { label: 'Condición: Todas', value: null },
        { label: 'Condición: Si', value: 'si' },
        { label: 'Condición: No', value: 'no' },
    ];

    const onCondicionFilterChange = (e) => {
        setCondicionFilterValue(e.value); // Update the separate state
    };

    // --- Calculate filtered data using useMemo ---
    const filteredEstudiantes = useMemo(() => {
        const sourceData = Array.isArray(estudiante) ? estudiante : [];
        console.log(`Recalculando filteredEstudiantes. Condicion: ${condicionFilterValue}, Source count: ${sourceData.length}`); // Log

        // Apply custom 'condicion' filter
        let filteredData = sourceData;
        if (condicionFilterValue !== null) {
            filteredData = sourceData.filter(item => {
                const normalizedValue = item.condicion?.toString().toUpperCase() ?? '';
                if (condicionFilterValue === 'no') {
                    return normalizedValue === 'NO' || normalizedValue === '';
                } else if (condicionFilterValue === 'si') {
                    return normalizedValue !== '' && normalizedValue !== 'NO';
                }
                return true;
            });
        }
        console.log(`Count after condition filter: ${filteredData.length}`); // Log
        return filteredData;
        // The DataTable will apply the 'filters' prop (sexo, edad, global) internally AFTER this
    }, [estudiante, condicionFilterValue]);


    const renderHeader = () => {
        return (
            <div className="table-header-container">
                <div className="button-container">
                    {/* ... Add Button ... */}
                    {role === 'admin' && (
                        <NavLink className="p-button p-component p-button-success" to="/estudiantes/new">
                            <span className="pi pi-plus p-button-icon p-button-icon-left"></span>
                            AÑADIR ALUMNO
                        </NavLink>
                    )}
                </div>
                 {/* --- Filters Row --- */}
                <div className="filters-container">
                    <div className="searcher p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilter} // Bind to globalFilter state
                            onChange={onGlobalFilterChange}
                            placeholder="Buscar..."
                            className="search-bar"
                        />
                    </div>
                    {/* Dropdown for Sexo Filter */}
                    <Dropdown
                        value={filters.sexo.value} // Bind to main filters state
                        options={sexOptions}
                        onChange={onSexoFilterChange} // Updates main filters state
                        placeholder="Sexo"
                        showClear
                    />
                    {/* Dropdown for Edad Filter */}
                    <Dropdown
                        value={filters.edad.value} // Bind to main filters state
                        options={edadOptions}
                        onChange={onEdadFilterChange} // Updates main filters state
                        placeholder="Edad"
                        showClear
                    />
                    {/* Dropdown for Custom Condicion Filter */}
                    <Dropdown
                        value={condicionFilterValue} // Bind to specific state
                        options={condicionOptions}
                        onChange={onCondicionFilterChange} // Updates specific state
                        placeholder="Condición"
                        showClear
                    />
                    <Button
                        label="Limpiar"
                        icon="pi pi-filter-slash"
                        onClick={resetFilters}
                        className="p-button-outlined p-button-secondary"
                        tooltip="Quitar todos los filtros"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>
            </div>
        );
    };

    const onRowSelect = (e) => {
        if (e.value) {
            setSelectedEstudiante(e.value);
        }
    };

    return (
        <div className="estudiantes-page">
            <div className="estudiantes-table">
                <Toast ref={toast} />
                <DataTable
                    value={filteredEstudiantes} // Use the manually (by condicion) filtered data
                    paginator rows={10} rowsPerPageOptions={[10, 25, 50]}
                    header={renderHeader()}
                    // Pass the standard filters state for internal DataTable filtering (sexo, edad, global)
                    filters={filters}
                    // Let DataTable handle global filter internally based on 'filters' state
                    // globalFilter={globalFilter} // This might be redundant if global is in 'filters' state
                    globalFilterFields={['nombres', 'apellidos', 'cedulaEscolar']} // Needed for global search
                    emptyMessage="No se encontraron Estudiantes."
                    selectionMode="single"
                    selection={selectedEstudiante}
                    onSelectionChange={onRowSelect}
                    dataKey="estudiante_id"
                    removableSort
                    // No filterDisplay needed if filters are in header
                >
                    {/* Define columns */}
                    <Column field="cedulaEscolar" header="CED" sortable />
                    <Column field="nombres" header="NOMBRES" sortable />
                    <Column field="apellidos" header="APELLIDOS" sortable />
                    {/* <Column field="fechaNacimiento" header="FECHA DE NACIMIENTO" sortable /> */}
                    <Column field="edad" header="EDAD" sortable />
                    <Column field="sexo" header="SEXO" sortable />
                     {/* Condicion column NOT rendered */}
                </DataTable>
            </div>
        </div>
    );
};