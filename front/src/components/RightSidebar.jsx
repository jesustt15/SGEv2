/* eslint-disable react-hooks/rules-of-hooks */
import { useLocation, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RightSidebarCalendar } from './RightSidebarCalendar';
import { EstudianteDetails } from '../estudiantes';
import { PersonalDetails } from '../personals';
import { useEstudiante, useEvento, usePersonal, useSeccion, useUsuario } from '../context';
import { SeccionDetails } from '../secciones';
import { UsuarioDetails } from '../usuarios';

// --- Helper function to format ISO time string to HH:MM ---
const formatTime = (isoString) => {
  if (!isoString) {
    return ''; // Return empty if no time string provided
  }
  try {
    // Create Date object using the ISO string (which includes timezone info)
    const dateObj = new Date(isoString);
    // Get local hours and minutes, padding with '0' if they are single digit
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", isoString, error);
    return 'Invalid Time'; // Fallback for parsing errors
  }
};
// --- End Helper Function ---


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
        console.log("Fetched Events Data:", eventoData); // Log fetched data
        setEvento(eventoData || []); // Ensure evento is always an array
      } catch (error) {
        console.error("Error fetching events: ", error);
        setEvento([]); // Set to empty array on error
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEventos]); // Removed setEvento from dependencies as it might cause loops if getEventos doesn't use useCallback

  // Efecto para filtrar los eventos para el día de hoy (LOCAL TIME).
  // Efecto para filtrar Y ORDENAR los eventos para el día de hoy (LOCAL TIME).
    useEffect(() => {
        // Ensure 'evento' is an array before filtering
        if (!Array.isArray(evento) || evento.length === 0) {
          console.log("Evento state is empty or not an array, skipping today's events filter.");
          setTodayEvents([]); // Ensure todayEvents is empty
          return;
        }
    
        // --- Get today's date based on LOCAL timezone ---
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // JS months are 0-indexed
        const day = now.getDate().toString().padStart(2, '0');
        const todayLocal = `${year}-${month}-${day}`; // Format "YYYY-MM-DD"
        // --- End ---
    
        console.log(`Filtering events for LOCAL today: "${todayLocal}"`);
    
        const todaysEventsFiltered = evento.filter(event => {
          // Asume que event.start_time es un timestamp ISO completo
          // Necesitamos extraer la parte de la fecha en la ZONA HORARIA LOCAL del evento
          // para comparar con todayLocal
          if (!event.start_time) return false; // Ignorar eventos sin hora de inicio
    
          try {
              // Crear objeto Date desde el timestamp
              const eventDateObj = new Date(event.start_time);
              // Obtener año, mes, día LOCALES del evento
              const eventYear = eventDateObj.getFullYear();
              const eventMonth = (eventDateObj.getMonth() + 1).toString().padStart(2, '0');
              const eventDay = eventDateObj.getDate().toString().padStart(2, '0');
              const eventDateLocal = `${eventYear}-${eventMonth}-${eventDay}`;
    
              // Comparar la fecha local del evento con la fecha local de hoy
              console.log(`Comparing event LOCAL date "${eventDateLocal}" with local today "${todayLocal}". Match: ${eventDateLocal === todayLocal}`);
              return eventDateLocal === todayLocal;
          } catch(error) {
              console.error("Error parsing event start_time for filtering:", event.start_time, error);
              return false; // No incluir si hay error de parseo
          }
        });
    
        console.log("Events filtered for local today (before sorting):", todaysEventsFiltered);
    
        // --- ORDENAR los eventos filtrados por hora de inicio ---
        const sortedEvents = todaysEventsFiltered.sort((a, b) => {
            try {
                // Convertir start_time (que son strings ISO) a objetos Date para comparar
                const dateA = new Date(a.start_time);
                const dateB = new Date(b.start_time);
    
                // Restar las fechas devuelve la diferencia en milisegundos,
                // lo que ordena de más temprano a más tarde.
                return dateA - dateB;
            } catch (error) {
                // Manejar posible error si start_time no es un string de fecha válido
                console.error("Error comparing event start times during sort:", a.start_time, b.start_time, error);
                return 0; // Si hay error, no cambiar el orden relativo de a y b
            }
        });
        // --- FIN DE LA ORDENACIÓN ---
    
        console.log("Sorted events for local today:", sortedEvents); // Log de los eventos ordenados
    
        // Guardar los eventos ORDENADOS en el estado
        setTodayEvents(sortedEvents);
    
      }, [evento]); // La dependencia sigue siendo 'evento' // Dependency is 'evento' state


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
              {todayEvents.map(eventoItem => ( // Renamed to avoid conflict with outer 'evento' state

                <li key={eventoItem.evento_id || eventoItem.id} className="task-item"> {/* Use a unique key */}
                  {/* --- FIX: Use formatTime helper function --- */}
                  <span className="task-time">{formatTime(eventoItem.start_time)}</span>
                  {/* --- End FIX --- */}
                  <p className="task-desc">{eventoItem.title}</p>
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




