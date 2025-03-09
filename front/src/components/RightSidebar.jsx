import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import '../App.css';

export const RightSidebar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <aside className="right-sidebar">
      {/* Sección del Calendario */}
      <div className="calendar-section">
        <h2 className="calendar-title">Calendario</h2>
        {/* El calendario se muestra "inline" para verse siempre */}
        <Calendar
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value)}
          inline
        />
      </div>

      {/* Sección de Mini Tareas */}
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
    </aside>
  );
};


