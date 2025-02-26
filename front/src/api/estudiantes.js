import axios from './config';

export const getEstudiantesRequest = () => axios.get('/estudiantes');
export const createEstudiantesRequest = (estudiante) => axios.post('/estudiantes/new', estudiante);
export const updateEstudianteRequest = (id, estudiante) => axios.put(`/estudiantes/${id}`, estudiante);
export const deleteEstudianteRequest = (id) => axios.delete(`/estudiantes/${id}`);
export const getOneEstudianteRequest = (id) => axios.get(`/estudiantes/${id}`);