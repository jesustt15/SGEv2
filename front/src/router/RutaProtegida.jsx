import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';


 export const RutaProtegida = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Si no hay usuario, redirige a /auth/
    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Evita redirigir a la ruta raíz si el usuario está autenticado
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }


    return <Outlet />;
};