import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Card, List, Tag, Spin, Empty } from 'antd';
import MainLayout from '../../Layouts/MainLayout';
import ticketService from '../../services/ticketService';

const { Title, Text } = Typography;

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    
    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        setTimeout(async () => {
          const response = await ticketService.getMyTickets();
          setTickets(response.data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };
    
    fetchMyTickets();
    window.history.replaceState(null, '', window.location.href);
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/my-tickets', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pagado':
        return 'green';
      case 'reservado':
        return 'blue';
      case 'cancelado':
        return 'red';
      default:
        return 'default';
    }
  };
  
  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Mis Boletos</Title>
        
        <Spin spinning={loading}>
          {tickets.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
              dataSource={tickets}
              renderItem={ticket => (
                <List.Item>
                  <Card 
                    title={`${ticket.ruta.origen} - ${ticket.ruta.destino}`}
                    extra={<Tag color={getStatusColor(ticket.estado)}>{ticket.estado}</Tag>}
                  >
                    <div>
                      <Text strong>Fecha: </Text>
                      <Text>{new Date(ticket.ruta.fecha).toLocaleDateString()}</Text>
                    </div>
                    <div>
                      <Text strong>Hora: </Text>
                      <Text>{ticket.ruta.hora}</Text>
                    </div>
                    <div>
                      <Text strong>Asiento: </Text>
                      <Text>{ticket.asiento}</Text>
                    </div>
                    <div>
                      <Text strong>Autobús: </Text>
                      <Text>{ticket.ruta.bus.numeroUnidad}</Text>
                    </div>
                    <div>
                      <Text strong>Código de Boleto: </Text>
                      <Text copyable>{ticket.codigo}</Text>
                    </div>
                    <div>
                      <Text strong>Fecha de Compra: </Text>
                      <Text>{new Date(ticket.fechaCompra).toLocaleDateString()}</Text>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty 
              description="No tienes boletos comprados" 
              style={{ marginTop: '40px' }}
            />
          )}
        </Spin>
      </div>
    </MainLayout>
  );
};

export default MyTicketsPage;