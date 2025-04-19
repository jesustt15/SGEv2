import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './components.css'; // Nuestros estilos personalizados
import { useEvento } from '../context';
import moment from 'moment';

export const RightSidebarCalendar = () => {
  const [date, setDate] = useState(new Date());
  const { evento, setEvento, getEventos } = useEvento();

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEventos();
      setEvento(data);
    };
    loadEvents();
  }, [getEventos, setEvento]);

  const renderDots = (tileDate) => {
    // Filtramos los eventos que coinciden con esta fecha.
    const eventsForDate = (evento || []).filter((event) => {
      const eventDate = moment(event.date, "YYYY-MM-DD").toDate();
      return eventDate.toDateString() === tileDate.toDateString();
    });
  
    // Si no hay eventos, no se renderiza nada.
    if (eventsForDate.length === 0) return null;
  
    // Si hay eventos, mapeamos para crear un dot por cada uno.
    return (
      <div className="dot-wrapper">
        {eventsForDate.map((event, index) => {
          const dotColor =
            event.type === 'escolar'
              ? '#d2f0ff'
              : event.type === 'administrativo'
              ? '#ffd9d9'
              : 'gray';

          return (
            <div
              key={event.id ? `${event.id}-${index}` : index}
              className="dot"
              style={{
                backgroundColor: dotColor,
              }}
            ></div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="calendar-section">
      <Calendar
        onChange={setDate}
        value={date}
        locale="es-ES"
        tileContent={({ date, view }) =>
          view === 'month' ? renderDots(date) : null
        }
      />
    </div>
  );
};

