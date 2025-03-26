import React, { useState, useEffect } from 'react';
import { Form, Input, message, Typography, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import FormButton from '../../Components/UI/FormButton';
import authService from '../../services/authService';


const { Title, Text, Link } = Typography;

const ResetPasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const { token } = useParams();
  
  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authService.resetPassword(token, values.password);
      setResetSuccess(true);
      message.success('Tu contraseña ha sido restablecida correctamente');
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      if (error.response && error.response.status === 400) {
        setTokenValid(false);
        message.error('El enlace es inválido o ha expirado');
      } else {
        message.error('No se pudo procesar tu solicitud. Inténtalo de nuevo más tarde.');
      }
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
            Restablecer contraseña
          </Title>
          
          {!tokenValid ? (
            <div style={{ textAlign: 'center' }}>
              <Text type="danger" style={{ display: 'block', marginBottom: 20 }}>
                El enlace es inválido o ha expirado. Por favor, solicita un nuevo enlace.
              </Text>
              <Link onClick={handleBackToLogin}>Volver al inicio de sesión</Link>
            </div>
          ) : resetSuccess ? (
            <div style={{ textAlign: 'center' }}>
              <Text style={{ display: 'block', marginBottom: 20 }}>
                ¡Tu contraseña ha sido restablecida exitosamente!
              </Text>
              <Link onClick={handleBackToLogin}>Ir al inicio de sesión</Link>
            </div>
          ) : (
            <>
              <Text style={{ display: 'block', marginBottom: 20 }}>
                Ingresa tu nueva contraseña.
              </Text>
              
              <Form
                form={form}
                name="resetPassword"
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Por favor ingresa tu nueva contraseña' },
                    { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                  ]}
                >
                  <Input.Password placeholder="Nueva contraseña" />
                </Form.Item>
                
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: 'Por favor confirma tu contraseña' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Las contraseñas no coinciden'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirmar contraseña" />
                </Form.Item>
                
                <Form.Item>
                  <FormButton 
                    text="Restablecer contraseña" 
                    loading={loading}
                  />
                </Form.Item>
              </Form>
            </>
          )}
        </Card>
      </div>
  );
};

export default ResetPasswordPage;