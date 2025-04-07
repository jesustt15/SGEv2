import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configuramos el localizador para react-big-calendar
const localizer = momentLocalizer(moment);

// Es importante setear el app element para accesibilidad
Modal.setAppElement('#root');

function CalendarWithModal() {
  // Estado para almacenar los eventos cargados desde el backend
  const [events, setEvents] = useState([]);
  // Estado para controlar la visibilidad del modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // Estado para guardar la información del evento que se está creando
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'escolar', // valor predeterminado
    color: '#000000'
  });

  // Cuando el componente se monta se buscan los eventos
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('http://localhost:3001/api/eventos');
        // Transformamos la fecha para que react-big-calendar pueda utilizarla correctamente
        const apiEvents = response.data.map(e => ({
          ...e,
          start: new Date(e.date),
          end: new Date(e.date)
        }));
        setEvents(apiEvents);
      } catch (err) {
        console.error("Error al cargar los eventos:", err);
      }
    }
    fetchEvents();
  }, []);

  // Función que se invoca al seleccionar un espacio (slot) del calendario
  const openModal = (slotInfo) => {
    // Prellenamos el campo de fecha con la fecha seleccionada
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");
    setEventData({ ...eventData, date: selectedDate });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Se podría resetear el formulario aquí si se desea
    setEventData({
      title: '',
      description: '',
      date: '',
      type: 'escolar',
      color: '#000000'
    });
  };

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Envía el nuevo evento al backend y actualiza el estado "events"
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/eventos', eventData);
      // Convertimos el evento recibido para react-big-calendar
      const newEvent = {
        ...response.data,
        start: new Date(response.data.date),
        end: new Date(response.data.date)
      };
      setEvents([...events, newEvent]);
      closeModal();
    } catch (err) {
      console.error("Error al crear el evento:", err);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Calendario de Eventos</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={openModal}
        // Opcional: personalizar el estilo de cada evento según el color guardado
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color || '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white'
          }
        })}
      />

      {/* Modal para crear un nuevo evento */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Evento"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <h2>Crear Evento</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Título:</label>
            <br />
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Descripción:</label>
            <br />
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Fecha:</label>
            <br />
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Tipo:</label>
            <br />
            <select name="type" value={eventData.type} onChange={handleInputChange}>
              <option value="escolar">Escolar</option>
              <option value="administrativo">Administrativo</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Color:</label>
            <br />
            <input
              type="color"
              name="color"
              value={eventData.color}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="submit">Guardar Evento</button>
            <button type="button" onClick={closeModal}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CalendarWithModal;
