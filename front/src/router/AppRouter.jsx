import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login } from '../auth';
import { RutaProtegida } from './RutaProtegida';
import { Estudiantes } from '../estudiantes';
import { Usuarios } from '../usuarios';
import { ProtectedLayout } from './ProtectedLayout';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<Login />} />
      
      <Route element={<RutaProtegida />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/auth/" />} />
    </Routes>
  );
};