/* eslint-disable react-hooks/rules-of-hooks */
import { useLocation, useMatch } from 'react-router-dom';
import { RightSidebarCalendar } from './RightSidebarCalendar';
import { EstudianteDetails } from '../estudiantes';
import {PersonalDetails} from '../personals';
import { useEstudiante, usePersonal, useSeccion } from '../context';
import { SeccionDetails } from '../secciones';

const RightSidebar = () => {
  const location = useLocation();
  const { selectedEstudiante } = useEstudiante();
  const { selectedPersonal } = usePersonal();
  const { selectedSeccion } = useSeccion();

  // Si estamos en la ruta 'estudiantes/new', no renderizamos el sidebar
  if (location.pathname.includes('estudiantes/new' ) || location.pathname.includes('personals/new' ) || 
            location.pathname.includes('calendar') || location.pathname.includes('secciones/new')  ) {
    return null;
  }

  // Usamos useMatch para detectar rutas del tipo /estudiantes/:id
  const matchEstudianteDetalle = useMatch('/estudiantes/:id');
  const matchPersonalDetalle = useMatch('/personals/:id');
  const matchSeccionDetalle = useMatch('/secciones/:id');
  if (matchEstudianteDetalle || matchPersonalDetalle || matchSeccionDetalle) {
    return null;
  }

  let content;
  // Contenido variable según la rutah
  if (location.pathname.includes('usuarios')) {
    content = <div>Contenido de Usuario: estadísticas o notificaciones.</div>;
  } else if (location.pathname.includes('estudiantes')) {
    content = (
      <div className="estudiantes-detail-container">
        <EstudianteDetails estudiante={selectedEstudiante} />
      </div>
    );
  } else if (location.pathname.includes('personals')){
    content = (
      <div className="estudiantes-detail-container">
        <PersonalDetails personal={selectedPersonal} />
      </div>
    )
  }else if (location.pathname.includes('secciones')){
    content = (
      <div className="estudiantes-detail-container">
        <SeccionDetails seccion={selectedSeccion} />
      </div>
    )
  }
  
  
  
  else {
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




