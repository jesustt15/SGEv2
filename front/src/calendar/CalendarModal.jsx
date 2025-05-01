/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import moment from 'moment';
import momentTZ from 'moment-timezone'; // Asegúrate de tener moment-timezone instalado
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
  startTime: startTimeStr, // Hora de inicio del evento
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
      // Intenta obtener el valor de diferentes estructuras de evento comunes
      let rawValue = e?.target ? e.target.value : (e?.value !== undefined ? e.value : e); 
  
      // --- LOGS DE DEPURACIÓN ---
      console.log(`handleInputChange RECIBIDO - Campo: ${fieldName}`);
      console.log(`  -> Tipo de valor crudo: ${typeof rawValue}`);
      console.log(`  -> Es instancia de Date?: ${rawValue instanceof Date}`);
      console.log(`  -> Valor crudo:`, rawValue);
      // -------------------------
  
      let processedValue; // Usar una variable separada para el valor procesado
  
      if (rawValue instanceof Date) { // Si ES un objeto Date
          console.log(`  -> Procesando como Date...`);
          if (fieldName === 'date') {
              processedValue = moment(rawValue).format('YYYY-MM-DD');
              console.log(`    * Formateado (date) a: ${processedValue}`);
          } else if (fieldName === 'startTime' || fieldName === 'endTime') {
              const d = rawValue;
              processedValue =
                  ("0" + d.getHours()).slice(-2) + ":" +
                  ("0" + d.getMinutes()).slice(-2) + ":" +
                  ("0" + d.getSeconds()).slice(-2);
              console.log(`    * Formateado (time) a: ${processedValue}`); // <-- Verifica si este log aparece y muestra "HH:mm:ss"
          } else {
              processedValue = rawValue; // Campo desconocido que es Date
              console.log(`    * Mantenido (otro Date) como:`, processedValue);
          }
      } else { // Si NO es un objeto Date
          console.log(`  -> Procesando como NO Date...`);
          // Aquí podrías intentar parsear si es una cadena ISO, pero es mejor arreglar la entrada
          processedValue = rawValue; // Por ahora, mantenemos el valor como está
           console.log(`    * Mantenido (NO Date) como:`, processedValue);
      }
  
      console.log(`handleInputChange FINAL - Campo: ${fieldName}, Valor a establecer en estado: ${processedValue}`); 
      if (fieldName) {
          setFormData(prev => ({
              ...prev,
              [fieldName]: processedValue // Guarda el valor procesado
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

        if (!formData.date || !moment(formData.date, "YYYY-MM-DD", true).isValid()) {
            alert("Por favor, seleccione una fecha válida.");
            return;
        }

        if (!formData.startTime || !/^\d{2}:\d{2}:\d{2}$/.test(formData.startTime) || !moment(formData.startTime, "HH:mm:ss", true).isValid()) {
             alert("Por favor, seleccione una hora de inicio válida (HH:mm:ss).");
             console.error("Validation failed for startTime:", formData.startTime); // Log extra si falla
             return;
        }
         // Hora de fin (Check format and validity)
        if (!formData.endTime || !/^\d{2}:\d{2}:\d{2}$/.test(formData.endTime) || !moment(formData.endTime, "HH:mm:ss", true).isValid()) {
             alert("Por favor, seleccione una hora de fin válida (HH:mm:ss).");
             console.error("Validation failed for endTime:", formData.endTime); // Log extra si falla
             return;
        }
        // --- FIN VALIDACIONES ---

        // Crear el objeto moment para la fecha del evento
        const eventDate = moment(formData.date, "YYYY-MM-DD");

        // --- Simplificar extracción y combinación de hora ---
        // Dividimos la cadena "HH:mm:ss" para obtener los componentes numéricos
        const [startHours, startMinutes, startSeconds] = formData.startTime.split(':').map(Number);
        const [endHours, endMinutes, endSeconds] = formData.endTime.split(':').map(Number);

        // Combinar la fecha base con las horas/minutos/segundos extraídos
        const finalStartTime = eventDate.clone()
            .hour(startHours)       // Establece la hora
            .minute(startMinutes)   // Establece los minutos
            .second(startSeconds);  // Establece los segundos

        const finalEndTime = eventDate.clone()
            .hour(endHours)
            .minute(endMinutes)
            .second(endSeconds);
        // --- Fin Simplificación ---

        // Opcional: Validar que la hora de fin no sea anterior a la de inicio
        if (finalEndTime.isBefore(finalStartTime)) {
             alert("La hora de fin no puede ser anterior a la hora de inicio.");
             return;
        }

        console.log('Inicio del evento:', finalStartTime.format("YYYY-MM-DD HH:mm:ss"));
        console.log('Fin del evento:', finalEndTime.format("YYYY-MM-DD HH:mm:ss"));

        // El payload sigue igual, ahora se genera de forma más directa
        const payload = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            date: formData.date, // Sigue siendo YYYY-MM-DD
            start_time: finalStartTime.format("YYYY-MM-DD HH:mm:ss"),
            end_time: finalEndTime.format("YYYY-MM-DD HH:mm:ss"),
            color: formData.color
        };

        console.log("Payload a enviar:", payload);

        // Lógica de envío (create/update)
        if (modalMode === "create") {
            await createEvento(payload);
        } else if (modalMode === "edit") {
            await updateEvento(formData.id, payload);
        }
        await getEventos(); // Refrescar eventos
        closeModal(); // Cerrar modal

    } catch (error) {
        console.error("Error procesando el evento:", error);
        const backendError = error.response?.data?.error || error.message;
        alert(`Error al guardar el evento: ${backendError}`);
    }
};
  
  
  
  
  
const calendarEvents = (evento || []).map((evt) => {
  // Define la zona horaria en la que quieres visualizar los eventos
  const displayTimezone = 'America/Caracas';

  // Parsea los strings que vienen de la base (se asume que están en UTC) usando momentTZ.utc
  const startUtcMoment = momentTZ.utc(evt.start_time);
  const endUtcMoment = momentTZ.utc(evt.end_time);

  // Verifica que se parseen correctamente
  if (!startUtcMoment.isValid() || !endUtcMoment.isValid()) {
      console.warn("Evento con fecha/hora inválida o no parseable como UTC:", evt);
      return null;
  }

  // Convierte esos momentos UTC a la zona local deseada
  const startLocalMoment = startUtcMoment.tz(displayTimezone);
  const endLocalMoment = endUtcMoment.tz(displayTimezone);

  // Verifica la conversión
  if (!startLocalMoment.isValid() || !endLocalMoment.isValid()) {
      console.warn("Fallo al convertir la hora del evento a la zona local para mostrar:", evt);
      return null;
  }

  // Determina el color de fondo basado en el tipo
  const bgColor =
      evt.type === 'administrativo' ? '#ffd9d9' :
      evt.type === 'escolar' ? '#d2f0ff' :
      evt.color || '#3174ad';

  return {
      id: evt.evento_id,
      title: evt.title,
      // Convertir el objeto moment a Date para que FullCalendar lo interprete correctamente
      start: startLocalMoment.toDate(), 
      end: endLocalMoment.toDate(),
      backgroundColor: bgColor,
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
    <div   className='event-content-little'
    style={{
      backgroundColor: eventInfo.event.backgroundColor || '#3174ad',
    }} >
      <b>{eventInfo.timeText}</b> 
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
            height: '75vh',
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
                    
                </div>
              </div>
              <hr className="divider" />
                    <div className="group">
                      <div className="group-item">
                        <label htmlFor="" className="label-modal">INICIO</label>
                        <p className='p-modal'>{formData.startTime}</p>
                      </div>
                      <div className="group-item">
                        <label htmlFor="" className="label-modal">FINALIZACIÓN</label>
                        <p className='p-modal'>{formData.endTime}</p>
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

