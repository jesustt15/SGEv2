import axios from './config';

export const getPersonalsRequest = () => axios.get('/personals');
export const createPersonalsRequest = (personal) => axios.post('/personals/', personal);
export const updatePersonalRequest = (id, personal) => axios.put(`/personals/${id}`, personal);
export const deletePersonalRequest = (id) => axios.delete(`/personals/${id}`);
export const getOnePersonalRequest = (id) => axios.get(`/personals/${id}`);