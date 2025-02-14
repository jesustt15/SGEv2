import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/sge',
});

const obtenerToken = () => localStorage.getItem('token');
const obtenerRol = () => localStorage.getItem('role');

instance.interceptors.request.use(
    (config) => {
        const token = obtenerToken();
        const role = obtenerRol();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (role) {
            config.headers['Role'] = role;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;

