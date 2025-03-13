import React from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardOutlined } from '@ant-design/icons';
import authService from '../services/authService';

import busImage from '../Components/UI/bus.png';
const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'administrador';
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  return (
    <Header style={{ backgroundColor: '#004D61', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/home">
            <img 
              src={busImage} 
              alt="Bus Seat Manager" 
              style={{ height: '40px', marginRight: '10px' }} 
            />
          </Link>
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Menu 
            theme="dark" 
            mode="horizontal" 
            style={{ backgroundColor: '#004D61', color: 'white' }}
          >
            <Menu.Item key="home">
              <Link to="/home">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="trips">
              <Link to="/trips">Viajes</Link>
            </Menu.Item>
            <Menu.Item key="tickets">
              <Link to="/my-tickets">Mis Boletos</Link>
            </Menu.Item>
          </Menu>
        </div>
        
        <div>
          {currentUser ? (
            <Space>
              {isAdmin && (
                <Button 
                  type="primary" 
                  icon={<DashboardOutlined />} 
                  onClick={() => navigate('/admin')}
                  style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57', marginRight: '10px' }}
                >
                  Admin
                </Button>
              )}
              <Button 
                type="primary" 
                onClick={handleLogout} 
                style={{ backgroundColor: '#A20025', borderColor: '#A20025' }}
              >
                Cerrar Sesión
              </Button>
            </Space>
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