
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components';
import { useAuth } from '../context';


export const ProtectedLayout = () => {
  const [menuVisible, setMenuVisible] = useState(true); // Estado para controlar la visibilidad del Sidebar
  const { name } = useAuth('');

  return (
    <div className="protected-layout">
      {menuVisible && <Sidebar />}
      <div className={`main-content ${menuVisible ? '' : 'expanded'}`}>
        <div className="header">
          <button
            className="menu-toggle-button"
            onClick={() => setMenuVisible(!menuVisible)}
            aria-label="Toggle Menu"
          >
            <i className={`pi ${menuVisible ? 'pi-bars' : 'pi pi-bars'}`}></i>
          </button>
          <h1>Bienvenido, {name}</h1>
        </div>
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
