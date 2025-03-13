import React from 'react';
import { Card, Typography, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/trips/${trip._id}`);
  };
  
  return (
    <Card 
      hoverable
      style={{ marginBottom: '16px', borderRadius: '8px' }}
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={6}>
          <Title level={4} style={{ margin: '0' }}>{trip.origen} - {trip.destino}</Title>
          <Text>{new Date(trip.fecha).toLocaleDateString()} - {trip.hora}</Text>
        </Col>
        <Col xs={24} md={6}>
          <Text strong>Precio: </Text>
          <Text type="success">${trip.precio}</Text>
        </Col>
        <Col xs={24} md={6}>
          <Text strong>Autobús: </Text>
          <Text>{trip.bus?.numeroUnidad || 'N/A'}</Text>
        </Col>
        <Col xs={24} md={6} style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            onClick={handleViewDetails}
            style={{ backgroundColor: '#007BFF', borderColor: '#007BFF' }}
          >
            Ver Detalles
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default TripCard;