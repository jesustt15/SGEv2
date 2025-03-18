import axios from './config';

export const getAutorizadosRequest = () => axios.get('/autorizados');
export const createAutorizadosRequest = (autorizado) => axios.post('/autorizados/', autorizado);
export const updateAutorizadoRequest = (id, autorizado) => axios.put(`/autorizados/${id}`, autorizado);
export const deleteAutorizadoRequest = (id) => axios.delete(`/autorizados/${id}`);
export const getOneAutorizadoRequest = (id) => axios.get(`/autorizados/${id}`);