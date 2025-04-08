import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import moment from 'moment';
import { useEvento } from '../context'; // Ajusta la ruta si es necesario

// Configurar el elemento raíz para accesibilidad
Modal.setAppElement('#root');

export default function CalendarWithModal() {
  // Extraemos las funciones y el estado del contexto, incluyendo updateEvento
  const { evento, getEventos, createEvento, updateEvento } = useEvento();

  // Estados para controlar el modal, el formulario y el modo del modal:
  //  "create": crear un nuevo evento
  //  "view": visualizar detalles del evento
  //  "edit": editar un evento existente
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "view" | "edit"
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    date: '',
    type: 'escolar', // valor por defecto
    color: '#000000'
  });

  // Al montar el componente, cargamos los eventos desde la BD
  useEffect(() => {
    getEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando se selecciona una fecha, se abre el modal para crear un evento.
  const handleDateSelect = (selectInfo) => {
    setModalMode("create");
    const startDate = selectInfo.startStr; // formato ISO (YYYY-MM-DD)
    setFormData({
      id: '',
      title: '',
      description: '',
      date: startDate,
      type: 'escolar',
      color: '#000000'
    });
    setModalIsOpen(true);
  };

  // Cuando se hace click en un evento, se abre el modal en modo visualización
  const handleEventClick = (clickInfo) => {
    const clickedEvent = clickInfo.event;
    const eventDetails = {
      id: clickedEvent.id,
      title: clickedEvent.title,
      description: clickedEvent.extendedProps.description,
      date: moment(clickedEvent.start).format("YYYY-MM-DD"),
      type: clickedEvent.extendedProps.type,
      color: clickedEvent.backgroundColor,
    };
    setFormData(eventDetails);
    setModalMode("view");
    setModalIsOpen(true);
  };

  // Función para iniciar el modo edición desde el modo visualización
  const handleEdit = () => {
    setModalMode("edit");
  };

  // Cierra el modal y resetea el formulario (además de forzar el modo "create")
  const closeModal = () => {
    setModalIsOpen(false);
    setModalMode("create");
    setFormData({
      id: '',
      title: '',
      description: '',
      date: '',
      type: 'escolar',
      color: '#000000'
    });
  };

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Envía la información del formulario según el modo, creando o actualizando
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createEvento(formData); // API para crear evento
      } else if (modalMode === "edit") {
        await updateEvento(formData.id, formData); // API para actualizar evento
      }
      await getEventos(); // refrescamos los eventos tras la acción
      closeModal();
    } catch (error) {
      console.error("Error procesando el evento:", error);
    }
  };

  // Transformamos los eventos del contexto al formato que FullCalendar necesita
  const calendarEvents = evento.map((evt) => {
    // Convertimos la fecha usando moment para evitar desfases
    const eventDate = moment(evt.date, 'YYYY-MM-DD').toDate();
    // Definimos el color según el tipo
    const bgColor =
      evt.type === 'administrativo' ? 'red' :
      evt.type === 'escolar' ? 'blue' :
      evt.color; // Caso extra

    return {
      id: evt.evento_id,
      title: evt.title,
      start: eventDate,
      end: eventDate,
      allDay: true, // Evento de día completo
      backgroundColor: bgColor,
      extendedProps: {
        description: evt.description,
        type: evt.type,
      },
    };
  });

  // Función para renderizar el contenido de cada evento en el calendario
  function renderEventContent(eventInfo) {
    return (
      <div
        style={{
          backgroundColor: eventInfo.event.backgroundColor || '#3174ad',
          padding: '2px',
          borderRadius: '3px'
        }}
      >
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <h1>Calendario de Eventos</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        events={calendarEvents}
        eventContent={renderEventContent}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // fondo semitransparente
            zIndex: 1000
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            width: '400px'
          }
        }}
        contentLabel={modalMode === "create" ? "Crear Evento" : modalMode === "edit" ? "Editar Evento" : "Información del Evento"}
      >
        {modalMode === "view" ? (
          // Modo visualización: muestra la información y el botón de edición
          <>
            <h2>Información del Evento</h2>
            <p><strong>Título:</strong> {formData.title}</p>
            <p><strong>Descripción:</strong> {formData.description}</p>
            <p><strong>Fecha:</strong> {formData.date}</p>
            <p><strong>Tipo:</strong> {formData.type}</p>
            <p>
              <strong>Color:</strong>
              <span
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  backgroundColor: formData.color,
                  marginLeft: '10px'
                }}
              />
            </p>
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleEdit}>Editar Evento</button>
              <button onClick={closeModal} style={{ marginLeft: '10px' }}>Cerrar</button>
            </div>
          </>
        ) : (
          // Modo "create" o "edit": se muestra el formulario
          <>
            <h2>{modalMode === "create" ? "Crear Nuevo Evento" : "Editar Evento"}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Título:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Descripción:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="date">Fecha:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="type">Tipo:</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="escolar">Escolar</option>
                  <option value="administrativo">Administrativo</option>
                </select>
              </div>
              <div>
                <label htmlFor="color">Color:</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <button type="submit">
                  {modalMode === "create" ? "Guardar Evento" : "Actualizar Evento"}
                </button>
                <button type="button" onClick={closeModal} style={{ marginLeft: '10px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
}

