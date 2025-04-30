/* eslint-disable react-hooks/exhaustive-deps */
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
import { confirmDialog } from 'primereact/confirmdialog';

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
  date: '', // Debe ser YYYY-MM-DD string
  startTime: '08:00:00', // Debe ser HH:mm:ss string
  endTime: '12:00:00',   // Debe ser HH:mm:ss string (Ajustado default)
  type: 'escolar',
  color: '#000000' // Puede que no necesites color aquí si se basa en 'type'
   });
  
  useEffect(() => {
    getEventos();
    }, []);
  
  
  const handleDateSelect = (selectInfo) => {
   setModalMode("create");
   const startDate = selectInfo.startStr; // "YYYY-MM-DD"
   setFormData({
   // Reinicia todos los campos al crear
   id: '',
   title: '',
   description: '',
   date: startDate,
   startTime: '08:00:00', // valor predeterminado
   endTime: '12:00:00',   // valor predeterminado
   type: 'escolar',
   color: '#000000'
   });
   setModalIsOpen(true);
  };
  
    const handleEventClick = (clickInfo) => {
   const clickedEvent = clickInfo.event;
      // IMPORTANTE: Lee las horas desde el evento original si existen
      // Asume que tu backend devuelve start_time y end_time como timestamps completos
      const startTimeStr = clickedEvent.start ? moment(clickedEvent.start).format("HH:mm:ss") : '08:00:00';
      const endTimeStr = clickedEvent.end ? moment(clickedEvent.end).format("HH:mm:ss") : '12:00:00';
      const dateStr = clickedEvent.start ? moment(clickedEvent.start).format("YYYY-MM-DD") : '';
  
  
  const eventDetails = {
   id: clickedEvent.id,
   title: clickedEvent.title || '',
   description: clickedEvent.extendedProps?.description || '',
   date: dateStr, // Fecha del evento
  tartTime: startTimeStr, // Hora de inicio del evento
  endTime: endTimeStr,   // Hora de fin del evento
    type: clickedEvent.extendedProps?.type || 'escolar',
    color: clickedEvent.backgroundColor || '#000000',
  };
  setFormData(eventDetails);
  setModalMode("view");
  setModalIsOpen(true);
  };
  
   const handleEdit = () => {
    setModalMode("edit");
   }; 
   const closeModal = () => {
   setModalIsOpen(false);
   // Opcional: No reiniciar aquí si siempre reinicias al ABRIR el modal
   setFormData({
   id: '', title: '', description: '', date: '',
   startTime: '08:00:00', endTime: '12:00:00', type: 'escolar', color: '#000000'
   });
   };
  
    // Modificamos handleInputChange para manejar Date de Calendar (fecha y hora)
    const handleInputChange = (e, name) => {
      const fieldName = name || e.target?.name;
      let value;
      
      // Para componentes de PrimeReact (Calendar, Dropdown, etc.)
      if (e && e.target === undefined && e.value !== undefined) {
        if (e.value instanceof Date) {
          if (fieldName === 'date') {
            value = moment(e.value).format('YYYY-MM-DD');
          } else if (fieldName === 'startTime' || fieldName === 'endTime') {
            value = moment(e.value).format('HH:mm:ss');
          } else {
            value = e.value;
          }
        } else {
          value = e.value;
        }
      } else if (e && e.target) { // Inputs HTML normales
        value = e.target.value;
      } else {
        value = e;
      }
      
      console.log(`handleInputChange - Campo: ${fieldName}, Valor a establecer: ${value}`);
      
      if (fieldName) {
        setFormData(prevFormData => ({
          ...prevFormData,
          [fieldName]: value
        }));
      } else {
        console.warn("handleInputChange recibió un evento sin nombre de campo:", e);
      }
    };
    
    
  
  
     const confirmDelete = () => {
       if (!formData.id) return; // Asegurarse que hay un ID
      confirmDialog({
       message: '¿Está seguro que desea eliminar este evento?',
       header: 'Confirmación de eliminación',
       icon: 'pi pi-exclamation-triangle',
       acceptLabel: 'Si',
       rejectLabel: 'No',
       accept: async () => {
        try {
             await deleteEvento(formData.id);
              await getEventos(); // Recargar eventos
              closeModal();
          } catch(error) {
              console.error("Error al eliminar:", error);
          }
     },
     reject: () => {}
    });
    };
  
   // Envía el formulario para crear o editar
   const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Valores de formData al inicio de handleSubmit:", JSON.stringify(formData, null, 2));
    
    try {
      // Validaciones
      if (!formData.date || !moment(formData.date, "YYYY-MM-DD", true).isValid()) {
        alert("Por favor, seleccione una fecha válida.");
        return;
      }
      if (!formData.startTime || !moment(formData.startTime, "HH:mm:ss", true).isValid()) {
        alert("Por favor, seleccione una hora de inicio válida.");
        return;
      }
      if (!formData.endTime || !moment(formData.endTime, "HH:mm:ss", true).isValid()) {
        alert("Por favor, seleccione una hora de fin válida.");
        return;
      }
      
      // Crear el objeto moment para la fecha del evento
      const eventDate = moment(formData.date, "YYYY-MM-DD");
      const startTimeMoment = moment(formData.startTime, "HH:mm:ss");
      const endTimeMoment = moment(formData.endTime, "HH:mm:ss");
      
      // Combinar la fecha con las horas seleccionadas
      const finalStartTime = eventDate.clone()
        .hours(startTimeMoment.hours())
        .minutes(startTimeMoment.minutes())
        .seconds(startTimeMoment.seconds());
      const finalEndTime = eventDate.clone()
        .hours(endTimeMoment.hours())
        .minutes(endTimeMoment.minutes())
        .seconds(endTimeMoment.seconds());
      
      console.log('Inicio del evento:', finalStartTime.format("YYYY-MM-DD HH:mm:ss"));
      console.log('Fin del evento:', finalEndTime.format("YYYY-MM-DD HH:mm:ss"));
      
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: formData.date,
        start_time: finalStartTime.format("YYYY-MM-DD HH:mm:ss"),
        end_time: finalEndTime.format("YYYY-MM-DD HH:mm:ss"),
        color: formData.color
      };
      
      console.log("Payload a enviar:", payload);
      
      if (modalMode === "create") {
        await createEvento(payload);
      } else if (modalMode === "edit") {
        await updateEvento(formData.id, payload);
      }
      await getEventos();
      closeModal();
    } catch (error) {
      console.error("Error procesando el evento:", error);
      const backendError = error.response?.data?.error || error.message;
      alert(`Error al guardar el evento: ${backendError}`);
    }
  };
  
  
  
  const calendarEvents = (evento || []).map((evt) => {
    const startMoment = moment(evt.start_time, "YYYY-MM-DD HH:mm:ss");
    const endMoment = moment(evt.end_time, "YYYY-MM-DD HH:mm:ss");
    if (!startMoment.isValid() || !endMoment.isValid()) {
      console.warn("Evento con fecha/hora inválida:", evt);
      return null;
    }
    const bgColor =
      evt.type === 'administrativo' ? '#ffd9d9' :
      evt.type === 'escolar' ? '#d2f0ff' :
      evt.color || '#3174ad';
  
    return {
      id: evt.evento_id,
      title: evt.title,
      start: startMoment.toDate(),  // Objeto Date local
      end: endMoment.toDate(),
      backgroundColor: bgColor,
      // NO incluir allDay si el evento es con hora
      extendedProps: {
        description: evt.description,
        type: evt.type,
      },
    };
  }).filter(event => event !== null);
  // Filtrar nulos si hubo errores de parseo
  
    function renderEventContent(eventInfo) {
      // ... (tu función de renderizado está bien)
    return (
    <div /* ... */ >
      <b>{eventInfo.timeText}</b> {/* Muestra la hora si no es allDay */}
      <i>{eventInfo.event.title}</i>
    </div>
    );
  }
  
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
        {console.log("Modal de vista", formData)}
            <div className="form-modal">
              <div className="group-header-modal">
                <label className='label-modal'>EVENTO</label>
           
                <div className="group-btn">
                  <Button className="btn-outline" icon="pi pi-trash" onClick={confirmDelete} />
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
                    <hr className="divider" />
                    <label htmlFor="" className="label-modal">INICIO</label>
                    <p className='p-modal'>{formData.tartTime}</p>
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
                           <label htmlFor="startTime">Hora de inicio</label>
<Calendar
  id="startTime"
  name="startTime"
  value={formData.startTime ? moment(formData.startTime, "HH:mm:ss").toDate() : null}
  onChange={(e) => handleInputChange(e, 'startTime')}
  timeOnly
  hourFormat="12" // o "24" según prefieras
  showIcon
  required
/>

<label htmlFor="endTime">Hora de finalización</label>
<Calendar
  id="endTime"
  name="endTime"
  value={formData.endTime ? moment(formData.endTime, "HH:mm:ss").toDate() : null}
  onChange={(e) => handleInputChange(e, 'endTime')}
  timeOnly
  hourFormat="12"
  showIcon
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

