import { PanelMenu } from "primereact/panelmenu"
import { NavLink } from "react-router-dom";
import { useAuth } from "../context";


export const Sidebar = () => {


  const {logout} = useAuth()
  
  const items = [
    {
        label: 'Estudiantes',
        icon: 'pi pi-file',
        items: [
            {
                label: 'Mostrar Estudiantes',
                icon: 'pi pi-plus',
                template: (item, options) => {
                  return (
                      <NavLink to="/estudiantes" className={options.className}>
                          <i className={options.iconClassName}></i>
                          <span className={options.labelClassName}>{item.label}</span>
                      </NavLink>
                  );
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
                template: (item, options) => {
                  return (
                      <NavLink to="/usuarios" className={options.className}>
                          <i className={options.iconClassName}></i>
                          <span className={options.labelClassName}>{item.label}</span>
                      </NavLink>
                  );
              }
            }
        ]
    },
    {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        className: 'sign-out',
        command: () => {
          logout();
        }
    }
];
  
  
  return (

    <>
        <div className="sidebar">
            <PanelMenu model={items} className="w-full md:w-15rem" />
        </div>
    </>
   
  )
}
