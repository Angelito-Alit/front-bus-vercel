import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layouts/MainLayout';

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Result
        status="error"
        title="El pago no pudo completarse"
        subTitle="Ha ocurrido un problema durante el proceso de pago. Puedes intentarlo nuevamente."
        extra={[
          <Button type="primary" key="retry" onClick={() => navigate(-1)}>
            Intentar Nuevamente
          </Button>,
          <Button key="home" onClick={() => navigate('/home')}>
            Volver al Inicio
          </Button>,
        ]}
      />
    </MainLayout>
  );
};

export default PaymentFailurePage;