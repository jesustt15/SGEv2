/* eslint-disable react-hooks/rules-of-hooks */
import { useLocation, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RightSidebarCalendar } from './RightSidebarCalendar';
import { EstudianteDetails } from '../estudiantes';
import { PersonalDetails } from '../personals';
import { useEstudiante, useEvento, usePersonal, useSeccion } from '../context';
import { SeccionDetails } from '../secciones';

const RightSidebar = () => {
  const location = useLocation();

  // Llamamos a todos los hooks de forma incondicional.
  const { selectedEstudiante } = useEstudiante();
  const { selectedPersonal } = usePersonal();
  const { selectedSeccion } = useSeccion();
  const { evento, setEvento, getEventos } = useEvento();
  const [todayEvents, setTodayEvents] = useState([]);

  // Siempre se llaman estos hooks, sin retornos condicionales previos.
  const matchEstudianteDetalle = useMatch('/estudiantes/:id');
  const matchPersonalDetalle = useMatch('/personals/:id');
  const matchSeccionDetalle = useMatch('/secciones/:id');

  // Efecto para traer los eventos.
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventoData = await getEventos();
        setEvento(eventoData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvents();
  }, [getEventos]);

  // Efecto para filtrar los eventos para el día de hoy.
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaysEvents = evento.filter(event => {
      // Supongamos que en la BD se almacena la fecha en event.date en formato ISO.
      const eventDate = event.date.split("T")[0];
      return eventDate === today;
    });
    setTodayEvents(todaysEvents);
  }, [evento]);

  // Variable que indica si debe o no renderizarse el sidebar.
  const shouldRenderSidebar =
    !(
      location.pathname.includes('estudiantes/new') ||
      location.pathname.includes('personals/new') ||
      location.pathname.includes('calendar') ||
      location.pathname.includes('secciones/new') ||
      matchEstudianteDetalle ||
      matchPersonalDetalle ||
      matchSeccionDetalle
    );

  if (!shouldRenderSidebar) {
    return null;
  }

  // Preparar el contenido del sidebar.
  let content;
  if (location.pathname.includes('usuarios')) {
    content = <div>Contenido de Usuario: estadísticas o notificaciones.</div>;
  } else if (location.pathname.includes('estudiantes')) {
    content = (
      <div className="estudiantes-detail-container">
        <EstudianteDetails estudiante={selectedEstudiante} />
      </div>
    );
  } else if (location.pathname.includes('personals')) {
    content = (
      <div className="estudiantes-detail-container">
        <PersonalDetails personal={selectedPersonal} />
      </div>
    );
  } else if (location.pathname.includes('secciones')) {
    content = (
      <div className="estudiantes-detail-container">
        <SeccionDetails seccion={selectedSeccion} />
      </div>
    );
  } else {
    content = (
      <>
        <RightSidebarCalendar />
        <div className="mini-tasks-section">
          <h2 className="tasks-title">Tareas de Hoy</h2>
          {todayEvents.length > 0 ? (
            <ul className="tasks-list">
              {todayEvents.map(evento => (
                <li key={evento.id} className="task-item">
                  <span className="task-time">{evento.date}</span>
                  <p className="task-desc">{evento.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-tasks">No hay eventos hoy</p>
          )}
        </div>
      </>
    );
  }

  return <aside className="right-sidebar">{content}</aside>;
};

export { RightSidebar };





