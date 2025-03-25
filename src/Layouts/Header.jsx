import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Space, Modal, Dropdown, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import NotificationCenter from '../Components/NotificationCenter';

import busImage from '../Components/UI/bus.png';
const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'administrador';
  const [logoutModal, setLogoutModal] = useState(false);
  
  useEffect(() => {
    if (currentUser && !authService.hasMFAEnabled()) {
      message.warning('Es obligatorio configurar la autenticación de dos factores');
      navigate('/setup-mfa');
    }
  }, [currentUser, navigate]);
  
  const handleLogout = () => {
    setLogoutModal(true);
  };
  
  const confirmLogout = () => {
    authService.logout();
    setLogoutModal(false);
    navigate('/login');
  };
  
  const setupMFA = () => {
    navigate('/setup-mfa');
  };
  
  const userMenuItems = [
    {
      key: '1',
      disabled: true,
      label: (
        <div style={{ padding: '0 8px' }}>
          <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
            Hola, {currentUser ? currentUser.nombre : 'Usuario'}
          </span>
        </div>
      )
    },
    {
      type: 'divider'
    },
    
    {
      key: '3',
      danger: true,
      label: 'Cerrar sesión',
      onClick: handleLogout
    }
  ];
  
  const mainMenuItems = [
    {
      key: 'home',
      label: <Link to="/home">Inicio</Link>
    },
    {
      key: 'trips',
      label: <Link to="/trips">Viajes</Link>
    },
    {
      key: 'tickets',
      label: <Link to="/my-tickets">Mis Boletos</Link>
    }
  ];
  
  if (currentUser && !authService.hasMFAEnabled()) {
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
            <h2 style={{ color: 'white' }}>
              Configure la autenticación de dos factores para continuar
            </h2>
          </div>
          
          <div>
            <Button 
              type="primary" 
              onClick={setupMFA}
              style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
            >
              Configurar 2FA
            </Button>
          </div>
        </div>
      </Header>
    );
  }
  
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
            items={mainMenuItems}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {currentUser ? (
            <Space>
              <NotificationCenter />
              
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
              
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button 
                  type="primary" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#A20025', borderColor: '#A20025' }}
                >
                  Mi Cuenta
                </Button>
              </Dropdown>
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
      
      <Modal
        title="Cerrar sesión"
        open={logoutModal}
        onOk={confirmLogout}
        onCancel={() => setLogoutModal(false)}
        okText="Cerrar sesión"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro que deseas cerrar sesión?</p>
      </Modal>
    </Header>
  );
};

export default AppHeader;