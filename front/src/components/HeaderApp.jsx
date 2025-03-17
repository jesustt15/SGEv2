import { useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useAuth } from '../context';
import  Logo  from '../assets/logo.png';

export const HeaderApp = () => {
  const { logout, name } = useAuth();
  const menuRef = useRef(null);

  const items = [
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        logout();
      },
    },
  ];

  return (
    <div className="header-app">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>

      {/* Menú de usuario en la parte derecha */}
      <div className="user-menu">
        <div
          className="user-details"
          onClick={(e) => menuRef.current.toggle(e)}
        >
          <Avatar icon="pi pi-user" shape="circle" />
          <span>{name}</span>
          <i className="pi pi-caret-down" style={{ marginLeft: '0.5rem' }}></i>
        </div>
        <Menu model={items} popup ref={menuRef} />
      </div>
    </div>
  );
};
