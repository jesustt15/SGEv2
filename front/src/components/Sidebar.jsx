import { PanelMenu } from 'primereact/panelmenu';
import { Avatar } from 'primereact/avatar';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context';

export const Sidebar = () => {
  const { logout, name, role } = useAuth();

  const items = [
    {
      label: 'Estudiantes',
      icon: 'pi pi-address-book',
      items: [
        {
          label: 'Mostrar Estudiantes',
          icon: 'pi pi-list',
          template: (item, options) => (
            <NavLink to="/estudiantes" className={options.className}>
              <i className={options.iconClassName}></i>
              <span className={options.labelClassName}>{item.label}</span>
            </NavLink>
          ),
        },
        ...(role === 'admin'
          ? [
              {
                label: 'Editar Estudiante',
                icon: 'pi pi-pencil',
                template: (item, options) => (
                  <NavLink to="/estudiantes/editar" className={options.className}>
                    <i className={options.iconClassName}></i>
                    <span className={options.labelClassName}>{item.label}</span>
                  </NavLink>
                ),
              },
              {
                label: 'Borrar Estudiante',
                icon: 'pi pi-trash',
                template: (item, options) => (
                  <NavLink to="/estudiantes/borrar" className={options.className}>
                    <i className={options.iconClassName}></i>
                    <span className={options.labelClassName}>{item.label}</span>
                  </NavLink>
                ),
              },
            ]
          : []),
      ],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Ver Usuarios',
          icon: 'pi pi-user',
          template: (item, options) => (
            <NavLink to="/usuarios" className={options.className}>
              <i className={options.iconClassName}></i>
              <span className={options.labelClassName}>{item.label}</span>
            </NavLink>
          ),
        },
        ...(role === 'admin'
          ? [
              {
                label: 'Agregar Usuario',
                icon: 'pi pi-user-plus',
                template: (item, options) => (
                  <NavLink to="/usuarios/new" className={options.className}>
                    <i className={options.iconClassName}></i>
                    <span className={options.labelClassName}>{item.label}</span>
                  </NavLink>
                ),
              },
              {
                label: 'Editar Usuario',
                icon: 'pi pi-user-edit',
                template: (item, options) => (
                  <NavLink to="/usuarios/editar" className={options.className}>
                    <i className={options.iconClassName}></i>
                    <span className={options.labelClassName}>{item.label}</span>
                  </NavLink>
                ),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="sidebar">
      <div className="user-info">
        <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
        <p>{name}</p>
      </div>
      <div className="menu-content">
        <PanelMenu model={items} className="w-full" />
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
          className="w-full"
        />
      </div>
    </div>
  );
};


