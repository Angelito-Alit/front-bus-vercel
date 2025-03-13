import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/home" />;
  }
  
  return children;
};

export default AdminRoute;