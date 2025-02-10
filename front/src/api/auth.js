import axios from "axios";

export const loginRequest = async (user) => axios.post('http://localhost:3000/sge/auth/', user);

export const logoutRequest = async () => axios.post('http://localhost:3000/sge/auth/');