/* eslint-disable react-refresh/only-export-components */ 
/* eslint-disable react/prop-types */ 
import { createContext, useContext, useRef, useState } from "react"; 
import { createEventosRequest, deleteEventoRequest, getOneEventoRequest, getEventosRequest, updateEventoRequest } from "../api"; 
import { useNavigate } from "react-router-dom"; 
import { Toast } from 'primereact/toast'; 

const EventoContext = createContext(); 

export const useEvento = () => { const context = useContext(EventoContext); 
    if (!context) { throw new Error('useEvento debe estar en el contexto'); 
    } 
    return context; 
}; 
    
    export function EventoProvider({ children }) { 
        const [evento, setEvento] = useState([]); const toast = useRef(null); // Referencia para el Toast 
        const navigate = useNavigate(); 
        
        
        const getEventos = async () => { 
            try { 
                const res = await getEventosRequest(); 
                setEvento(res.data); 
            } catch (error) { 
                console.error("Error fetching Evento:", error); 
            } }; 

        const createEvento = async (evento) => {
             try { 
                await createEventosRequest(evento); 
                getEventos(); 
                toast.current.show({ severity: 'success', summary: 'Registro Exitoso', detail: 'Nuevo Evento agregado', life: 3000, });
                navigate('/calendar'); 
            } catch (error) { 
                console.error("Error creating events:", error); 
                throw error; // Re-throw the error to be caught in the component 
                } 
            }; 
            
            const updateEvento = async (id, evento) => { 
                try { 
                    await updateEventoRequest(id, evento); 
                    getEventos(); 
                } catch (error) { 
                    console.error("Error updating evento:", error); 
                } 
            }; 
            
            const deleteEvento = async (id) => { 
                try { 
                    const res = await deleteEventoRequest(id); 
                    if (res.status === 204) setEvento(evento.filter((user) => evento._id !== id));
                     getEventos(); 
                    } catch (error) { 
                        console.error("Error deleting evento:", error); 
                    } }; 
            
            const getOneEvento = async (id) => { 
                try { 
                    const res = await getOneEventoRequest(id); 
                    return res.data; 
                } catch (error) { 
                    console.error("Error fetching evento:", error); 
                } 
            }; 
            
            return ( <EventoContext.Provider 
                value={{ 
                    evento, 
                    setEvento, 
                    createEvento, 
                    getEventos, 
                    deleteEvento, 
                    updateEvento, 
                    getOneEvento 
                }}> 
                {children}
                 <Toast ref={toast} /> </EventoContext.Provider> ); 
            }