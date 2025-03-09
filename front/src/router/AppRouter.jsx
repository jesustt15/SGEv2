
import { Routes, Route } from 'react-router-dom';
import {DashboardLayout }from './DashboardLayout';
import { Home } from '../auth';
import { Estudiantes, NewEstudiante } from '../estudiantes';
import { Usuarios, NewUsuario } from '../usuarios';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="estudiantes" element={<Estudiantes />} />
        <Route path="estudiantes/new" element={<NewEstudiante />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="usuarios/new" element={<NewUsuario />} />
      </Route>
    </Routes>
  );
};

