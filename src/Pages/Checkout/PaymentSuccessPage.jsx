import React, { useEffect, useState } from 'react';
import { Result, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';
import ticketService from '../../services/ticketService';
const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState(null);
  useEffect(() => {
    const verifyPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const paymentId = searchParams.get('payment_id');
      const status = searchParams.get('status');
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = function() {
        window.history.pushState(null, null, window.location.href);
      };
      if (paymentId && status === 'approved') {
        try {
          const storedTrip = sessionStorage.getItem('selectedTrip');
          const storedSeats = sessionStorage.getItem('selectedSeats');
          if (storedTrip && storedSeats) {
            const trip = JSON.parse(storedTrip);
            const seats = JSON.parse(storedSeats);
            await ticketService.verifyPayment(paymentId, trip._id, seats[0]);
            sessionStorage.removeItem('selectedTrip');
            sessionStorage.removeItem('selectedSeats');
          }
          navigate('/my-tickets');
        } catch (error) {
          console.error('Error verificando pago:', error);
        }
      }
    };
    verifyPayment();
  }, [location, navigate]);
  return (
    <MainLayout>
      <Result
        status="success"
        title="¡Pago completado con éxito!"
        subTitle="Tu boleto ha sido generado y lo encontrarás en la sección 'Mis Boletos'."
        extra={[
          <Button type="primary" key="tickets" onClick={() => navigate('/my-tickets')}>
            Ver Mis Boletos
          </Button>,
          <Button key="home" onClick={() => navigate('/home')}>
            Volver al Inicio
          </Button>,
        ]}
      />
    </MainLayout>
  );
};
export default PaymentSuccessPage;