import axios from './config';

export const getEventosRequest = () => axios.get('/eventos');
export const createEventosRequest = (evento) => axios.post('/eventos/new', evento);
export const updateEventoRequest = (id, evento) => axios.put(`/eventos/${id}`, evento);
export const deleteEventoRequest = (id) => axios.delete(`/eventos/${id}`);
export const getOneEventoRequest = (id) => axios.get(`/eventos/${id}`);