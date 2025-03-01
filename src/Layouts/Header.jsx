
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

import busImage from '../Components/UI/bus.png'; // Importa la imagen
const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  return (
    <Header style={{ backgroundColor: '#004D61', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo">
          <Link to="/">
            <img 
              src={busImage} 
              alt="Bus Seat Manager" 
              style={{ height: '40px', marginRight: '10px' }} 
            />
          </Link>
        </div>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          style={{ backgroundColor: '#004D61', color: 'white' }}
        >
          <Menu.Item key="home">
            <Link to="/">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="trips">
            <Link to="/trips">Viajes</Link>
          </Menu.Item>
        </Menu>
        <div>
          {currentUser ? (
            <Button type="primary" onClick={handleLogout} style={{ backgroundColor: '#A20025', borderColor: '#A20025' }}>
              Cerrar Sesión
            </Button>
          ) : (
            <>
              <Button type="primary" style={{ marginRight: '10px', backgroundColor: '#007BFF', borderColor: '#007BFF' }}>
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button style={{ backgroundColor: '#F9F7ED', borderColor: '#F9F7ED', color: '#004D61' }}>
                <Link to="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;