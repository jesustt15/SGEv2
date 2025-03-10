import { useLocation } from 'react-router-dom';
import { RightSidebarCalendar } from './RightSidebarCalendar';
import {  EstudianteDetails } from '../estudiantes';


const selectedEstudiante = {
  cedulaEscolar: '123456',
  nombres: 'Juan',
  apellidos: 'Pérez',
  fechaNacimiento: '2000-01-01',
  edad: 22,
  sexo: 'M',
};


const RightSidebar = () => {
  const location = useLocation();

  let content;
  // Ejemplo sencillo para contenido variable según ruta
  if (location.pathname.includes('usuarios')) {
    content = <div>Contenido de Usuario: estadísticas o notificaciones.</div>;
  } else if (location.pathname.includes('estudiantes')) {
    content =   <div className="estudiantes-detail-container">
                  <EstudianteDetails estudiante={selectedEstudiante} />
                </div>;
  } else {
    // Contenido por defecto: calendario y mini tareas
    content = (
      <>
        <RightSidebarCalendar />
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



