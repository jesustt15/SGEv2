import axios from "axios";

export const loginRequest = async (user) => axios.post('http://localhost:8000/sge/auth/login', user);

export const logoutRequest = async () => axios.post('http://localhost:8000/sge/auth/logout');