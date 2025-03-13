import React, { useEffect } from 'react';
import { Row, Col, Button, Typography, Card, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BulbOutlined, SafetyOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import MainLayout from '../../Layouts/MainLayout';
import authService from '../../services/authService';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
    window.history.replaceState(null, '', window.location.href);

    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/home', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
  
  return (
    <MainLayout>
      <Row justify="center" align="middle" style={{ padding: '40px 20px' }}>
        <Col xs={24} md={20} lg={18} style={{ textAlign: 'center' }}>
          <Title level={1} style={{ color: '#004D61' }}>Bienvenido a Bus Seat Manager</Title>
          <Paragraph style={{ fontSize: '18px', margin: '20px 0' }}>
            La forma más sencilla de reservar tus asientos de autobús en línea.
            Busca, selecciona y paga en minutos.
          </Paragraph>
          
          <div style={{ margin: '30px 0' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/trips')}
              style={{ backgroundColor: '#007BFF', borderColor: '#007BFF', marginRight: '15px' }}
            >
              Ver Viajes Disponibles
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/my-tickets')}
              style={{ backgroundColor: '#F9F7ED', borderColor: '#F9F7ED', color: '#004D61' }}
            >
              Mis Boletos
            </Button>
          </div>
          
          <Divider style={{ margin: '40px 0' }}>
            <Text strong style={{ fontSize: '18px' }}>¿Por qué elegirnos?</Text>
          </Divider>
          
          <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ height: '100%' }}
                cover={<BulbOutlined style={{ fontSize: '48px', margin: '24px 0', color: '#004D61' }} />}
              >
                <Title level={4}>Fácil de Usar</Title>
                <Paragraph>
                  Interfaz intuitiva que te permite reservar tus asientos en pocos pasos.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ height: '100%' }}
                cover={<SafetyOutlined style={{ fontSize: '48px', margin: '24px 0', color: '#004D61' }} />}
              >
                <Title level={4}>Seguridad</Title>
                <Paragraph>
                  Tus pagos y datos personales están protegidos con la mejor tecnología.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ height: '100%' }}
                cover={<ClockCircleOutlined style={{ fontSize: '48px', margin: '24px 0', color: '#004D61' }} />}
              >
                <Title level={4}>Ahorra Tiempo</Title>
                <Paragraph>
                  Olvídate de las filas en la terminal. Reserva desde cualquier lugar.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                hoverable 
                style={{ height: '100%' }}
                cover={<DollarOutlined style={{ fontSize: '48px', margin: '24px 0', color: '#004D61' }} />}
              >
                <Title level={4}>Mejores Precios</Title>
                <Paragraph>
                  Accede a promociones exclusivas y los mejores precios del mercado.
                </Paragraph>
              </Card>
            </Col>
          </Row>
          
          
        </Col>
      </Row>
    </MainLayout>
  );
};

export default HomePage;