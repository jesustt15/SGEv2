import axios from './config';

export const getSeccionesRequest = () => axios.get('/secciones');
export const createSeccionRequest = (seccion) => axios.post('/secciones/', seccion);
export const updateSeccionRequest = (id, seccion) => axios.put(`/secciones/${id}` ,seccion);
export const deleteSeccionRequest = (id) => axios.delete(`/secciones/${id}`);
export const getOneSeccionRequest = (id) => axios.get(`/secciones/${id}`);