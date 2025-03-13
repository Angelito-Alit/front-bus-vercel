import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Button } from 'antd';
import { UserOutlined, CarOutlined, RocketOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';
import tripService from '../../services/tripService';
import busService from '../../services/busService';
import ticketService from '../../services/ticketService';

const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    buses: 0,
    routes: 0,
    tickets: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [busesResponse, routesResponse, ticketsResponse] = await Promise.all([
          busService.getAllBuses(),
          tripService.getAllTrips(),
          ticketService.getAllTickets()
        ]);
        
        setStats({
          buses: busesResponse.data.length,
          routes: routesResponse.data.length,
          tickets: ticketsResponse.data.length || 0
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Panel de Administración</Title>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title="Autobuses"
                value={stats.buses}
                prefix={<CarOutlined />}
              />
              <Button 
                type="link" 
                onClick={() => navigate('/admin/buses')}
                style={{ padding: 0, marginTop: 8 }}
              >
                Gestionar Autobuses
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title="Rutas"
                value={stats.routes}
                prefix={<RocketOutlined />}
              />
              <Button 
                type="link" 
                onClick={() => navigate('/admin/routes')}
                style={{ padding: 0, marginTop: 8 }}
              >
                Gestionar Rutas
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title="Boletos Vendidos"
                value={stats.tickets}
                prefix={<FileOutlined />}
              />
              <Button 
                type="link" 
                onClick={() => navigate('/admin/tickets')}
                style={{ padding: 0, marginTop: 8 }}
              >
                Ver Boletos
              </Button>
            </Card>
          </Col>
        </Row>
        
        <Row style={{ marginTop: '20px' }}>
          <Col span={24}>
            <Card title="Acciones Rápidas">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Button 
                    type="primary" 
                    block 
                    onClick={() => navigate('/admin/buses')}
                    style={{ backgroundColor: '#004D61', borderColor: '#004D61' }}
                  >
                    Crear Nuevo Autobús
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button 
                    type="primary" 
                    block 
                    onClick={() => navigate('/admin/routes')}
                    style={{ backgroundColor: '#004D61', borderColor: '#004D61' }}
                  >
                    Crear Nueva Ruta
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button 
                    type="primary" 
                    block 
                    onClick={() => navigate('/admin/tickets')}
                    style={{ backgroundColor: '#004D61', borderColor: '#004D61' }}
                  >
                    Ver Todos los Boletos
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;