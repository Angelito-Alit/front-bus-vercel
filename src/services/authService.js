// src/services/authService.js
import api from './api';

const authService = {
  register: async (userData) => {
    try {
      console.log('Enviando datos de registro:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },
  
  login: async (credentials) => {
    try {
      console.log('Enviando credenciales:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Respuesta de login:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;