
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login } from '../auth';
import { RutaProtegida } from './RutaProtegida';
import { Estudiantes } from '../estudiantes';
import { Usuarios } from '../usuarios';
import { Sidebar } from '../components';

export const AppRouter = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Routes>
              <Route path="/auth/*" element={<Login />} />
              <Route element={<RutaProtegida />}>
                <Route path="/" element={<Home />} />
                <Route path="/estudiantes" element={<Estudiantes />} />
                <Route path="/usuarios" element={<Usuarios />} />
              </Route>
              <Route path="*" element={<Navigate to="/auth/" />} />
        </Routes>
    </div>
    </div>
    
    
  );
};
