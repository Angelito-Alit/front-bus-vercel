import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Card, Button, Divider, message, Spin } from 'antd';
import MainLayout from '../../Layouts/MainLayout';
import SeatMap from '../../Components/UI/SeatMap';
import tripService from '../../services/tripService';
const { Title, Text } = Typography;
const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [seatData, setSeatData] = useState({ available: [], occupied: [] });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const tripResponse = await tripService.getTripById(id);
        setTrip(tripResponse.data);
        const seatsResponse = await tripService.getAvailableSeats(id);
        console.log('Seat data from API:', seatsResponse.data); 
        setSeatData({
          available: seatsResponse.data.available || [],
          occupied: seatsResponse.data.occupied || []
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        message.error('No se pudo cargar los detalles del viaje');
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);
  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };
  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      message.warning('Por favor selecciona al menos un asiento');
      return;
    }
    sessionStorage.setItem('selectedTrip', JSON.stringify(trip));
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    
    navigate('/checkout');
  };
  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }
  if (!trip) {
    return (
      <MainLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Title level={3}>Viaje no encontrado</Title>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>{trip.origen} - {trip.destino}</Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card title="Detalles del Viaje">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Fecha: </Text>
                  <Text>{new Date(trip.fecha).toLocaleDateString()}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Hora: </Text>
                  <Text>{trip.hora}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Precio: </Text>
                  <Text>${trip.precio}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Autobús: </Text>
                  <Text>{trip.bus?.numeroUnidad || 'N/A'}</Text>
                </Col>
              </Row>
            </Card>
            <Divider />
            <Title level={3}>Selección de Asientos</Title>
            <Text>Selecciona los asientos que deseas reservar</Text>
            <div style={{ marginTop: '20px' }}>
              <SeatMap 
                availableSeats={seatData.available.map(seat => seat.numero)}
                occupiedSeats={seatData.occupied}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                busCapacity={trip.bus?.capacidad || 40}
              />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Resumen de Compra">
              <div>
                <Text strong>Viaje: </Text>
                <Text>{trip.origen} - {trip.destino}</Text>
              </div>
              <div>
                <Text strong>Fecha: </Text>
                <Text>{new Date(trip.fecha).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text strong>Hora: </Text>
                <Text>{trip.hora}</Text>
              </div>
              <Divider />
              <div>
                <Text strong>Asientos seleccionados: </Text>
                <Text>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Ninguno'}</Text>
              </div>
              <div>
                <Text strong>Precio por asiento: </Text>
                <Text>${trip.precio}</Text>
              </div>
              <div>
                <Text strong>Total: </Text>
                <Text type="success">${selectedSeats.length * trip.precio}</Text>
              </div>
              
              <Button 
                type="primary" 
                block 
                style={{ marginTop: '20px', backgroundColor: '#007BFF', borderColor: '#007BFF' }}
                onClick={handleProceedToCheckout}
                disabled={selectedSeats.length === 0}
              >
                Proceder al Pago
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};
export default TripDetailPage;