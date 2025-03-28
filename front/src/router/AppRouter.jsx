import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Home, Login } from '../auth';
import { Estudiantes, NewEstudianteStepper, EstudiantePage } from '../estudiantes';
import { Usuarios, NewUsuario } from '../usuarios';
import { RutaProtegida } from './RutaProtegida';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta pública para el login */}
      <Route path="/auth" element={<Login />} />

      {/* Todas las demás rutas se protegen */}
      <Route path="/" element={<RutaProtegida />}>
        {/* El DashboardLayout envuelve las rutas que se muestran después de iniciar sesión */}
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="estudiantes/new" element={<NewEstudianteStepper />} />
          <Route path="estudiantes/:id" element={<EstudiantePage />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/new" element={<NewUsuario />} />
        </Route>
      </Route>

      {/* Ruta comodín para redirigir a login en caso de rutas no definidas */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};


