import axios from './config';

export const getEstudiantesRequest = () => axios.get('/estudiantes');
export const createEstudiantesRequest = (estudiante) => axios.post('/estudiantes/', estudiante);
export const updateEstudianteRequest = (id, estudiante) => axios.put(`/estudiantes/${id}` ,estudiante);
export const updateSeccionEstudianteRequest = (estudiante_id, seccion_id) => axios.put(`/estudiantes/${estudiante_id}/edit-seccion` ,seccion_id);
export const deleteEstudianteRequest = (id) => axios.delete(`/estudiantes/${id}`);
export const getOneEstudianteRequest = (id) => axios.get(`/estudiantes/${id}`);