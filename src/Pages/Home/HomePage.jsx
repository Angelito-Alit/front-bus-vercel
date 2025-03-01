
import React, { useEffect } from 'react';
import { Row, Col, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';
import authService from '../../services/authService';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      message.warning('Por favor inicia sesión para acceder');
      navigate('/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    authService.logout();
    message.success('Has cerrado sesión correctamente');
    navigate('/login');
  };
  
  return (
    <MainLayout>
      <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 64px - 70px)', padding: '20px' }}>
        <Col xs={24} md={16} lg={12} style={{ textAlign: 'center' }}>
          <Title level={1}>Bienvenido {user?.nombre || ''}</Title>
          <Paragraph style={{ fontSize: '18px', margin: '20px 0' }}>
            La forma más sencilla de reservar tus asientos de autobús en línea.
            Busca, selecciona y paga en minutos.
          </Paragraph>
          <div style={{ margin: '30px 0' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/trips')}
              style={{ backgroundColor: '#007BFF', borderColor: '#007BFF', marginRight: '10px' }}
            >
              Ver Viajes Disponibles
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/register')}
              style={{ backgroundColor: '#F9F7ED', borderColor: '#F9F7ED', color: '#004D61' }}
            >
              Crear Cuenta
            </Button>
          </div>
          {user && (
            <div style={{ marginTop: '30px' }}>
              <Title level={3}>Información de usuario</Title>
              <Paragraph>Nombre: {user.nombre}</Paragraph>
              <Paragraph>Email: {user.email}</Paragraph>
              <Paragraph>Rol: {user.role}</Paragraph>
              
              <Button 
                type="primary" 
                danger
                onClick={handleLogout}
                style={{ marginTop: '20px', backgroundColor: '#A20025', borderColor: '#A20025' }}
              >
                Cerrar Sesión
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </MainLayout>
  );
};

export default HomePage;