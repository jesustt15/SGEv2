/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { loginRequest } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setAuthState({ token, role });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginRequest({username, password}) ;
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setAuthState({ token, role });
    } catch (error) {
      console.error('Error during login:', error);
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
    setAuthState({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};