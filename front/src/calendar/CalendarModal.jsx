import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import moment from 'moment';
import { useEvento } from '../context'; // Ajusta la ruta si es necesario
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import './index.css'
import { Button } from 'primereact/button';

// Configurar el elemento raíz para accesibilidad
Modal.setAppElement('#root');

export default function CalendarWithModal() {
  const { evento, getEventos, createEvento, updateEvento, deleteEvento } = useEvento();

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

  useEffect(() => {
    getEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Al seleccionar una fecha en FullCalendar
  const handleDateSelect = (selectInfo) => {
    setModalMode("create");
    const startDate = selectInfo.startStr; 
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

  // Al hacer click en un evento del calendario
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

  const handleEdit = () => {
    setModalMode("edit");
  };

  const handleDelete = async () => {
    
  }

  // Cierra el modal y reinicia el formulario
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

  // Manejador unificado para los inputs
  // Se revisa si el evento proviene de un componente PrimeReact (que envía e.value)
  // o es un evento estándar (que trae e.target.value)
  const handleInputChange = (e, name) => {
    let value;

    if (e && e.value !== undefined) {
      // Si es un objeto Date, lo convertimos a cadena en formato YYYY-MM-DD
      value = e.value instanceof Date
        ? e.value.toISOString().split('T')[0]
        : e.value;
    } else if (e && e.target) {
      value = e.target.value;
    }

    const fieldName = name || (e && e.target && e.target.name);
    setFormData({ ...formData, [fieldName]: value });
  };

  // Envía el formulario para crear o editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createEvento(formData);
        console.log('llamando a la bd');
      } else if (modalMode === "edit") {
        await updateEvento(formData.id, formData);
      }
      await getEventos();
      closeModal();
    } catch (error) {
      console.error("Error procesando el evento:", error);
    }
  };

  // Convertimos los eventos al formato requerido por FullCalendar
  const calendarEvents = evento.map((evt) => {
    const eventDate = moment(evt.date, 'YYYY-MM-DD').toDate();
    const bgColor =
      evt.type === 'administrativo' ? '#ffd9d9' :
      evt.type === 'escolar' ? '#d2f0ff' :
      evt.color; // Caso extra

    return {
      id: evt.evento_id,
      title: evt.title,
      start: eventDate,
      end: eventDate,
      allDay: true,
      backgroundColor: bgColor,
      extendedProps: {
        description: evt.description,
        type: evt.type,
      },
    };
  });

  // Renderiza el contenido de un evento en el calendario
  function renderEventContent(eventInfo) {
    return (
      <div
      className='event-content-little'
        style={{
          backgroundColor: eventInfo.event.backgroundColor || '#3174ad',
        }}
      >
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }

  // Opciones para el Dropdown del tipo de evento
  const typeOptions = [
    { label: 'Escolar', value: 'escolar' },
    { label: 'Administrativo', value: 'administrativo' }
  ];

  return (
    <div className="calendar-container">
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
        locale={'es'}
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día'
        }}
        height={"80vh"}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.42)',
            zIndex: 1000
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '15px',
            width: '60vh',
            height: '70vh',
            display:'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', 
            backgroundColor:'#f8f8f8'
          },
        }}
        contentLabel={
          modalMode === "create"
            ? "Crear Evento"
            : modalMode === "edit"
              ? "Editar Evento"
              : "Información del Evento"
        }
      >
        {modalMode === "view" ? (
          <>
            <div className="form-modal">
              <div className="group-header-modal">
                <label className='label-modal'>EVENTO</label>
           
                <div className="group-btn">
                  <Button onClick={handleDelete} className="btn-outline" icon="pi pi-trash" />
                  <Button className="btn-outline" icon="pi pi-pen-to-square"
                      onClick={handleEdit} />
                </div>
              </div>
              <hr className='divider'/>
              <label className='label-modal'>Título</label>
              <p className='p-modal'>{formData.title}</p>
              <hr className='divider'/>
              <label className='label-modal'>Descripción</label>
              <p className='p-modal'>{formData.description}</p>
              <hr className='divider'/>
              <div className="group">
                <div className="group-item">
                  <label className='label-modal'>Fecha</label>
                  <p className='p-modal'>{formData.date}</p>
                </div>
                <div className="group-item">
                  <label className='label-modal'>ETIQUETA</label>
                    <div className="group-item-color">
                    <span
                    style={{
                      display: 'inline-block',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: formData.color,
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }}
                  />
                  <p className='p-modal'>{formData.type}</p>
                    </div>
                </div>
              </div>
            </div>
            
          </>
        ) : (
          <>
            <label>{modalMode === "create" ? "AÑADIR EVENTO" : "Editar Evento"}</label>
            <form onSubmit={handleSubmit} className='form-modal'>
                <label htmlFor="title">Título</label>
                <InputText
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <label htmlFor="description">Descripción</label>
                <InputTextarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <div className="group-modal">
                  <div className="group-item-modal">
                    <label htmlFor="date">Fecha</label>
                    <Calendar
                      value={formData.date ? moment(formData.date, "YYYY-MM-DD").toDate() : null}
                      onChange={(e) => handleInputChange(e, 'date')}
                      dateFormat="dd/mm/yy"
                      required
                    />
                  </div>
                  <div className="group-item-modal">
                    <label htmlFor="type">ETIQUETA</label>
                    <Dropdown
                      id="type"
                      name="type"
                      value={formData.type}
                      options={typeOptions}
                      onChange={(e) => handleInputChange(e, 'type')}
                      placeholder="Seleccione un tipo"
                    />
                  </div>
                </div>
              <div style={{ marginTop: '10px' }}>
                <button type="submit" className='btn-next-modal'>
                  {modalMode === "create" ? "Guardar" : "Actualizar"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
}

