import axios from './config';

export const getRepresentantesRequest = () => axios.get('/representantes');
export const createRepresentantesRequest = (representante) => axios.post('/representantes', representante);
export const updateRepresentanteRequest = (id, representante) => axios.put(`/representantes/${id}`, representante);
export const deleteRepresentanteRequest = (id) => axios.delete(`/representantes/${id}`);
export const getOneRepresentanteRequest = (id) => axios.get(`/representantes/${id}`);