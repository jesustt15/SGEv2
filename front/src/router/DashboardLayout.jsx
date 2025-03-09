import { Outlet } from 'react-router-dom';
import { HeaderApp, RightSidebar, Sidebar } from '../components';

import '../App.css';

 export const DashboardLayout = () => {
  return (
    <div className="app-layout">
      <HeaderApp />
      <div className="page-layout">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

