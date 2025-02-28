// src/Pages/Auth/LoginPage.jsx
import React from 'react';
import { Row, Col, Card } from 'antd';
import Logo from '../../Components/UI/Logo';
import LoginForm from '../../Components/LoginForm';

const LoginPage = () => {
  return (
      <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Col xs={24} sm={20} md={16} lg={10} xl={8}>
          <Card 
            bordered={false} 
            style={{ 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#E8F0F2',
              border: 'none'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Logo size="medium" />
              <h2 style={{ marginTop: '20px' }}>Iniciar Sesión</h2>
            </div>
            <LoginForm />
          </Card>
        </Col>
      </Row>
  );
};

export default LoginPage;