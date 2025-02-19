import { PanelMenu } from "primereact/panelmenu"
import {Avatar} from "primereact/avatar";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context";


export const Sidebar = () => {


  const {logout, name} = useAuth();
  
  const items = [
    {
        label: 'Estudiantes',
        icon: 'pi pi-address-book',
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
                icon: 'pi pi-user',
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
];

  
  
  return (

    <>
        <div className="sidebar">
            <div className="user-info">
            <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                <p>{name}</p>
            </div>
            
            <div className="menu-content">
            <PanelMenu  model={items} className="w-full md:-15rem"/>
            </div>
            <div className="sign-out">
                <PanelMenu 
                         model={[
                            {
                              label: 'Sign Out',
                              icon: 'pi pi-sign-out',
                              command: () => {
                                logout();
                              },
                            },
                          ]}
                          className="w-full md:w-15rem"        
                
                />
            </div>
            
            
            
            
        </div>


    </>
   
  )
}
