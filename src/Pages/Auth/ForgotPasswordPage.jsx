import React, { useState } from 'react';
import { Form, Input, message, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import FormButton from '../../Components/UI/FormButton';
import authService from '../../services/authService';


const { Title, Text, Link } = Typography;

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword(values.email);
      setEmailSent(true);
      message.success('Se ha enviado un correo con instrucciones para restablecer tu contraseña');
    } catch (error) {
      console.error('Error al solicitar restablecimiento:', error);
      message.error('No se pudo procesar tu solicitud. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    navigate('/login');
  };
  
  return (
    
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '30px 20px'
      }}>
        <Card style={{ width: '100%', maxWidth: 400 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
            Recuperar contraseña
          </Title>
          
          {emailSent ? (
            <div style={{ textAlign: 'center' }}>
              <Text style={{ display: 'block', marginBottom: 20 }}>
                Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.
                Por favor, revisa tu bandeja de entrada.
              </Text>
              <Link onClick={handleBackToLogin}>Volver al inicio de sesión</Link>
            </div>
          ) : (
            <>
              <Text style={{ display: 'block', marginBottom: 20 }}>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </Text>
              
              <Form
                form={form}
                name="forgotPassword"
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor ingresa tu correo electrónico' },
                    { type: 'email', message: 'El correo electrónico no es válido' }
                  ]}
                >
                  <Input placeholder="Correo electrónico" />
                </Form.Item>
                
                <Form.Item>
                  <FormButton 
                    text="Enviar instrucciones" 
                    loading={loading}
                  />
                </Form.Item>
                
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Link onClick={handleBackToLogin}>Volver al inicio de sesión</Link>
                </div>
              </Form>
            </>
          )}
        </Card>
      </div>
  );
};

export default ForgotPasswordPage;