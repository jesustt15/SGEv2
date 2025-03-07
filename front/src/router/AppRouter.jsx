// src/router/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import { Home } from '../auth';
import { Estudiantes, NewEstudiante } from '../estudiantes';
import { Usuarios, NewUsuario } from '../usuarios';
import { Sidebar } from '../components/Sidebar'; // Asegúrate de usar la ruta correcta
import { HeaderApp } from '../components/HeaderApp';

export const AppRouter = () => {
  return (
    <div className="app-layout">
      <HeaderApp />
      <div className="body-layout">
        {/* Sidebar lateral */}
        <Sidebar />
        {/* Contenido principal */}
        <div className="main-content">
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
