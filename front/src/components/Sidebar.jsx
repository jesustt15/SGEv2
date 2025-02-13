import { PanelMenu } from "primereact/panelmenu"

export const Sidebar = () => {
  
  const items = [
    {
        label: 'Estudiantes',
        icon: 'pi pi-file',
        items: [
            {
                label: 'Mostrar Estudiantes',
                icon: 'pi pi-plus',
                command: () => {
                    
                }
            },
            {
                label: 'Mostrar Estudiantes',
                icon: 'pi pi-search',
                command: () => {
                   ;
                }
            }
        ]
    },
    {
        label: 'Usuarios',
        icon: 'pi pi-cloud',
        items: [
            {
                label: 'Ver Usuarios',
                icon: 'pi pi-cloud-download',
                command: () => {
                }
            }
        ]
    },
    {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => {
        }
    }
];
  
  
  
  
  
  return (

    <>
        <div className="card flex justify-content-center">
            <PanelMenu model={items} className="w-full md:w-20rem" />
        </div>
    </>
   
  )
}
