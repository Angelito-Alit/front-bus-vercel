import React from 'react';
import { Row, Col, Card } from 'antd';
import Logo from '../../Components/UI/Logo';
import RegisterForm from '../../Components/RegisterForm';

const RegisterPage = () => {
  return (

      <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Col xs={24} sm={20} md={16} lg={10} xl={8}>
          <Card 
            variant="borderless"
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#E8F0F2',
              border: 'none'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Logo size="medium" />
              <h2 style={{ marginTop: '20px' }}>Registro</h2>
            </div>
            <RegisterForm />
          </Card>
        </Col>
      </Row>
  );
};

export default RegisterPage;