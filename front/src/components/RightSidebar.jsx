import { useLocation } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../App.css';

const RightSidebar = () => {
  const location = useLocation();

  let content;
  // Ejemplo de contenido variable según la ruta actual
  if (location.pathname.includes('usuarios')) {
    content = <div>Contenido de Usuario: estadísticas o notificaciones.</div>;
  } else if (location.pathname.includes('estudiantes')) {
    content = <div>Contenido de Estudiantes: tareas pendientes y recordatorios.</div>;
  } else {
    // Contenido por defecto: mostraremos un calendario de PrimeReact y una lista de mini tareas
    content = (
      <>
        <div className="calendar-section">
          <Calendar inline />
        </div>
        <div className="mini-tasks-section">
          <h2 className="tasks-title">Mini Tareas</h2>
          <ul className="tasks-list">
            <li className="task-item">
              <span className="task-day">Lunes</span>
              <p className="task-desc">Revisar emails pendientes.</p>
            </li>
            <li className="task-item">
              <span className="task-day">Martes</span>
              <p className="task-desc">Actualizar reporte semanal.</p>
            </li>
            <li className="task-item">
              <span className="task-day">Miércoles</span>
              <p className="task-desc">Planificar reunión de equipo.</p>
            </li>
            <li className="task-item">
              <span className="task-day">Jueves</span>
              <p className="task-desc">Revisar avances del proyecto.</p>
            </li>
            <li className="task-item">
              <span className="task-day">Viernes</span>
              <p className="task-desc">Cerrar tareas pendientes.</p>
            </li>
          </ul>
        </div>
      </>
    );
  }

  return <aside className="right-sidebar">{content}</aside>;
};

export { RightSidebar };


