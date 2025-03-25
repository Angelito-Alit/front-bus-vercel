import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.requireMFA) {
      return {
        requireMFA: true,
        email: response.data.email
      };
    }
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  validateMFA: async (email, token) => {
    const response = await api.post('/auth/validate-mfa', { email, token });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'administrador';
  },
  
  setupMFA: async () => {
    const response = await api.post('/auth/setup-mfa');
    return response.data;
  },
  
  verifyAndActivateMFA: async (token) => {
    const response = await api.post('/auth/verify-mfa', { token });
    return response.data;
  },
  
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
  
  hasMFAEnabled: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.mfaEnabled === true;
  }
};

export default authService;