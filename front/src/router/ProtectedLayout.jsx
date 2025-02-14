
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components';

export const ProtectedLayout = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
