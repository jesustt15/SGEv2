import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login } from '../auth';
// import { RutaProtegida } from './RutaProtegida';
import { Estudiantes, NewEstudiante } from '../estudiantes';
import { NewUsuario, Usuarios } from '../usuarios';
// import { ProtectedLayout } from './ProtectedLayout';
import { Sidebar } from '../components';
import { useState } from 'react';

export const AppRouter = () => {
  
    const [menuVisible, setMenuVisible] = useState(true); // Estado para controlar la visibilidad del Sidebar
    
  
  
  
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
          <h1>Bienvenida, Silvia</h1>
        </div>
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/estudiantes/new" element={<NewEstudiante />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/new" element={<NewUsuario />} />
          </Routes>
        </div>
      </div>
    </div>
          
  );
};