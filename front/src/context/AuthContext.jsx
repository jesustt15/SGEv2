/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { loginRequest } from '../api';
import {useNavigate} from 'react-router-dom';
import { Toast } from 'primereact/toast';

export const AuthContext = createContext();

export const useAuth = () =>{
    

    const context = useContext(AuthContext);

    if (!context){
        throw new Error('useAuth debe estar en el contexto')
    }
     return context;

} 


export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false
  });
  const navigate = useNavigate();
  const toast = useRef(null); // Referencia para el Toast

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setAuthState({ token, role, isAuthenticated: true });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginRequest({username, password}) ;
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setAuthState({ token, role, isAuthenticated:true });
      toast.current.show({ severity: 'success', summary: 'Login Exitoso', detail: 'Bienvenido de nuevo!', life: 3000 });
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña incorrectos', life: 3000});
    }
  };

  const register = async (username, name, password, role) => {
    try {
      await axios.post('/api/register', { username, name, password, role });
      // You can handle the response as needed, for example logging the user in automatically
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthState({ token: null, role: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
      <Toast ref={toast} />
    </AuthContext.Provider>
  );
};