import  { useState } from 'react';
import Calendar from 'react-calendar';
import './components.css';       // Nuestros estilos personalizados

export const RightSidebarCalendar = () => {
  const [date, setDate] = useState(new Date());

  // Función para renderizar puntos de colores en ciertos días
  const renderDots = (date) => {
    const day = date.getDate();
    return (
      <>
        {([10, 15, 18].includes(day)) && <div className="dot green"></div>}
        {([9, 25, 26, 27, 28, 29, 30].includes(day)) && <div className="dot red"></div>}
      </>
    );
  };

  return (
    <div className="calendar-section">
      <Calendar
        onChange={setDate}
        value={date}
        locale="es-ES"
        // Agrega puntos en cada celda en la vista de mes
        tileContent={({ date, view }) =>
          view === 'month' ? renderDots(date) : null
        }
      />
    </div>
  );
};

