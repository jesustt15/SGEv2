// import axios from "axios";

// export const getUsuariosRequest = () => axios.get('http://localhost:8000/sge/users');
// export const createUsuariosRequest = (user) => axios.post('http://localhost:8000/sge/users', user);
// export const updateUsuarioRequest = (id, user)  => axios.put(`http://localhost:8000/sge/users/${id}`, user);
// export const deleteUsuarioRequest = (id) => axios.delete(`http://localhost:8000/sge/users/${id}`);
// export const getOneUsuarioRequest = (id) => axios.get(`http://localhost:8000/sge/users/${id}`);

// usuarios.js
import axios from './config';

export const getUsuariosRequest = () => axios.get('/users');
export const createUsuariosRequest = (user) => axios.post('/users', user);
export const updateUsuarioRequest = (id, user) => axios.put(`/users/${id}`, user);
export const deleteUsuarioRequest = (id) => axios.delete(`/users/${id}`);
export const getOneUsuarioRequest = (id) => axios.get(`/users/${id}`);
