// src/components/Sidebar.jsx
import  { useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context';
import Vector from '/src/assets/Vector.svg';
import { Dropdown } from 'primereact/dropdown';

export const Sidebar = () => {
  const { logout, name} = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Función para alternar el estado del sidebar
  const toggleSidebar = (e) => {
    e.stopPropagation(); // Aseguramos que solo se active el click en la header del sidebar
    setCollapsed((prev) => !prev);
  };

  // Definición de los items del menú
  const items = [
    
    // {
    //   label: 'Usuarios',
    //   icon: 'pi pi-users',
    //   template: (item, options) => (
    //         <NavLink to="/usuarios" className={options.className}>
    //           <i className={options.iconClassName}></i>
    //           {!collapsed && (
    //             <span className={options.labelClassName}>{item.label}</span>
    //           )}
    //         </NavLink>
    //       ),
    //   },
      {
        label: 'Inicio',
        icon: 'pi pi-objects-column',
        template: (item, options) => (
              <NavLink to="/" className={options.className}>
                <i className={options.iconClassName}></i>
                {!collapsed && (
                  <span className={options.labelClassName}>{item.label}</span>
                )}
              </NavLink>
            ),
        },
        {
          label: 'Matriculas',
          icon: 'pi pi-book', 
          template: (item, options) => (
            <NavLink to="/estudiantes" className={options.className}>
              <i className={options.iconClassName}></i>
              {!collapsed && (
                <span className={options.labelClassName}>{item.label}</span>
              )}
            </NavLink>
          ),
        },        
        {
          label: 'Personal',
          icon: 'pi pi-users',
          template: (item, options) => (
                <NavLink to="/usuarios" className={options.className}>
                  <i className={options.iconClassName}></i>
                  {!collapsed && (
                    <span className={options.labelClassName}>{item.label}</span>
                  )}
                </NavLink>
              ),
          },
          {
            label: 'Calendario de Actividades',
            icon: 'pi pi-calendar',
            template: (item, options) => (
                  <NavLink to="/usuarios" className={options.className}>
                    <i className={options.iconClassName}></i>
                    {!collapsed && (
                      <span className={options.labelClassName}>{item.label}</span>
                    )}
                  </NavLink>
                ),
            },
        {
          label: 'Niveles',
          icon: 'pi pi-users',
          template: (item, options) => (
                <NavLink to="/usuarios" className={options.className}>
                  <i className={options.iconClassName}></i>
                  {!collapsed && (
                    <span className={options.labelClassName}>{item.label}</span>
                  )}
                </NavLink>
              ),
          },
    ]

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      {/* Encabezado del sidebar: al hacer clic se alterna el estado */}
      <div className="sidebar-header" onClick={toggleSidebar}>
        {!collapsed && <p>{name}</p>}
        <i
          className={`pi ${
            collapsed ? 'pi-angle-right' : 'pi-angle-left'
          }`}
        ></i>
      </div>

      <div className="menu-content">
        <PanelMenu model={items} className="w-full" />
      </div>

      <div className="sign-out">
        <PanelMenu
          model={[
            {
              label: '  Gestion de Usuarios',
              icon: 'pi pi-cog',
              template: (item, options) => (
                <NavLink to="/usuarios" className={options.className}>
                  <i className={options.iconClassName}></i>
                  {!collapsed && (
                    <span className={options.labelClassName}>{item.label}</span>
                  )}
                </NavLink>
              ),
            },
          ]}
          className="w-full"
        />
      </div>
    </div>
  );
};



