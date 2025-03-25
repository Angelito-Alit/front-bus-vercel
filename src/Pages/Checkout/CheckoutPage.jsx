import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Card, Button, Divider, Steps, message, Result, Spin } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MainLayout from '../../Layouts/MainLayout';
import ticketService from '../../services/ticketService';
import mercadoPagoService from '../../services/mercadoPagoService';
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY);

const { Title, Text } = Typography;
const { Step } = Steps;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  
  useEffect(() => {
    const storedTrip = sessionStorage.getItem('selectedTrip');
    const storedSeats = sessionStorage.getItem('selectedSeats');
    
    if (!storedTrip || !storedSeats) {
      message.error('No se encontró información del viaje');
      navigate('/trips');
      return;
    }
    
    setTrip(JSON.parse(storedTrip));
    setSelectedSeats(JSON.parse(storedSeats));
  }, [navigate]);
  
  const calculateTotal = () => {
    if (!trip) return 0;
    return selectedSeats.length * trip.precio;
  };
  
  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      const response = await mercadoPagoService.createPreference(
        trip._id, 
        selectedSeats[0]
      );
      setPreferenceId(response.preferenceId);
    } catch (error) {
      console.error('Error al iniciar el pago:', error);
      message.error('Error al iniciar el proceso de pago');
    } finally {
      setLoading(false);
    }
  };
  const handleSimulatePayment = async () => {
    setLoading(true);
    
    try {
      const response = await ticketService.buyTicket({
        routeId: trip._id,
        asientoNumero: selectedSeats[0]
      });
      
      setTicket(response.data.ticket);
      setCurrentStep(1);
      setPaymentSuccess(true);
      sessionStorage.removeItem('selectedTrip');
      sessionStorage.removeItem('selectedSeats');
    } catch (error) {
      console.error('Error procesando el pago simulado:', error);
      message.error('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTickets = () => {
    navigate('/my-tickets');
  };
  
  if (!trip) {
    return (
      <MainLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Title level={3}>No hay información de compra</Title>
          <Button type="primary" onClick={() => navigate('/trips')}>
            Ver Viajes Disponibles
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Checkout</Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card>
              <Steps current={currentStep}>
                <Step title="Pago" icon={<CreditCardOutlined />} />
                <Step title="Confirmación" icon={<CheckCircleOutlined />} />
              </Steps>
              
              <Divider />
              
              {currentStep === 0 && (
                <div>
                  <Title level={3}>Proceso de Pago</Title>
                  <Text>Selecciona tu método de pago para completar la transacción.</Text>
                  
                  {loading ? (
                    <div style={{ textAlign: 'center', margin: '30px 0' }}>
                      <Spin size="large" />
                      <div style={{ marginTop: '10px' }}>Preparando opciones de pago...</div>
                    </div>
                  ) : (
                    <div>
                      {preferenceId ? (
                        <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center' }}>
                          <Wallet initialization={{ preferenceId }} />
                        </div>
                      ) : (
                        <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center' }}>
                          <Button 
                            type="primary" 
                            size="large"
                            onClick={handleInitiatePayment}
                            style={{ backgroundColor: '#009ee3', borderColor: '#009ee3', marginRight: '10px' }}
                          >
                            Pagar con Mercado Pago
                          </Button>
                          
                          
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {currentStep === 1 && paymentSuccess && (
                <Result
                  status="success"
                  title="¡Pago Completado!"
                  subTitle={`Código de boleto: ${ticket?.codigo}`}
                  extra={[
                    <Button 
                      type="primary" 
                      key="tickets" 
                      onClick={handleViewTickets}
                      style={{ backgroundColor: '#007BFF', borderColor: '#007BFF' }}
                    >
                      Ver Mis Boletos
                    </Button>,
                    <Button key="trips" onClick={() => navigate('/trips')}>
                      Buscar Más Viajes
                    </Button>,
                  ]}
                />
              )}
            </Card>
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
                <Text strong>Asientos: </Text>
                <Text>{selectedSeats.join(', ')}</Text>
              </div>
              <div>
                <Text strong>Cantidad: </Text>
                <Text>{selectedSeats.length}</Text>
              </div>
              <div>
                <Text strong>Precio por asiento: </Text>
                <Text>${trip.precio}</Text>
              </div>
              
              <Divider />
              
              <div>
                <Text strong style={{ fontSize: '16px' }}>Total: </Text>
                <Text type="success" style={{ fontSize: '16px' }}>${calculateTotal()}</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;