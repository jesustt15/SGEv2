
import { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useUsuario } from '../context';


export const Usuarios = () => {
    const {usuario, getUsuarios} = useUsuario()

    useEffect(() => {
        getUsuarios();
    }, []);

    useEffect(() => {
      getUsuarios();
  }, [usuario]);
    
    return (
        <div className="card">
            <DataTable value={usuario} paginator rows={10}>
                <Column field='username' header='Nombre de Usuario'  />
                <Column field='name' header='Nombre'  />
                <Column field='role' header='Role'  />
            </DataTable>
        </div>
    );
}