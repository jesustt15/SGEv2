/* eslint-disable react-hooks/rules-of-hooks */
import { useLocation, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RightSidebarCalendar } from './RightSidebarCalendar';
import { EstudianteDetails } from '../estudiantes';
import { PersonalDetails } from '../personals';
import { useEstudiante, useEvento, usePersonal, useSeccion, useUsuario } from '../context';
import { SeccionDetails } from '../secciones';
import { UsuarioDetails } from '../usuarios';
;

const RightSidebar = () => {
  const location = useLocation();

  // Llamamos a todos los hooks de forma incondicional.
  const { selectedEstudiante } = useEstudiante();
  const { selectedPersonal } = usePersonal();
  const { selectedSeccion } = useSeccion();
  const { selectedUsuario } = useUsuario();
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
        console.log(eventoData);
        setEvento(eventoData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvents();
  }, [getEventos]);

  // Efecto para filtrar los eventos para el día de hoy.
   useEffect(() => {
     // Ensure 'evento' is not null or undefined before filtering
     if (!evento || evento.length === 0) {
     console.log("Evento state is empty, skipping today's events filter.");
     setTodayEvents([]); // Ensure todayEvents is empty if evento is empty
      return;
     }
    
     const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    
        // --- Add debug log for filtering ---
        console.log(`Filtering events for today: "${today}"`);
        // --- End debug log ---
    
     const todaysEvents = evento.filter(event => {
            // --- Add debug log for each event comparison ---
            console.log(`Comparing event date "${event.date}" with today "${today}". Match: ${event.date === today}`);
            // --- End debug log ---
            return event.date === today
        });
        console.log("Events filtered for today:", todaysEvents);
        // --- End debug log ---
    
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
    content = <div className="estudiantes-detail-container">
    <UsuarioDetails usuario={selectedUsuario} />
  </div>
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
    console.log("Rendering RightSidebarCalendar and Tareas de Hoy section."); // Log when this section is chosen
    content = (
      <>
        <RightSidebarCalendar />
        <div className="mini-tasks-section">
          <h2 className="tasks-title">Tareas de Hoy</h2>
          {console.log(`Rendering tasks list. todayEvents.length: ${todayEvents.length}`)}
          {todayEvents.length > 0 ? (
            <ul className="tasks-list">
              {todayEvents.map(evento => (
                 
                <li key={evento.id} className="task-item">
                  <span className="task-time">{evento.start_time}</span>
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





