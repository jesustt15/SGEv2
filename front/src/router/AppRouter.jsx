import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Home, Login } from '../auth';
import { Estudiantes, NewEstudianteStepper, EstudiantePage, EstudianteEdit } from '../estudiantes';
import { Usuarios, NewUsuario } from '../usuarios';
import { RutaProtegida } from './RutaProtegida';
import { Personal, NewPersonal, PersonalPage, PersonalEdit } from '../personals';
import CalendarWithModal from '../calendar/CalendarModal';
import { NewSeccion, SeccionEdit, Secciones, SeccionPage } from '../secciones';

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
          <Route path="estudiantes/:id/more" element={<EstudiantePage />} />
          <Route path="estudiantes/:id" element={<EstudianteEdit />} />
          <Route path='personals' element={<Personal />} />
          <Route path='personals/new' element={<NewPersonal />} />
          <Route path="personals/:id/more" element={<PersonalPage />} />
          <Route path="personals/:id" element={<PersonalEdit />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/new" element={<NewUsuario />} />
          <Route path="secciones" element={<Secciones />} />
          <Route path="secciones/new" element={<NewSeccion />} />
          <Route path="secciones/:id" element={<SeccionEdit />} />
          <Route path="secciones/:id/more" element={<SeccionPage />} />

          <Route path="calendar" element={<CalendarWithModal />} />
        </Route>
      </Route>

      {/* Ruta comodín para redirigir a login en caso de rutas no definidas */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};


