// src/services/api.js
import axios from 'axios';
import authService from './authService';

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si recibimos un 401 (No autorizado), cerramos sesión
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;