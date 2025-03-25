import React, { useState } from 'react';
import { Form, Input, message, Modal, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import FormButton from './UI/FormButton';
import authService from '../services/authService';

const { Text, Link } = Typography;

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showMFAModal, setShowMFAModal] = useState(false);
  const [mfaEmail, setMfaEmail] = useState('');
  const [mfaForm] = Form.useForm();
  const navigate = useNavigate();
  
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function() {
    window.history.pushState(null, null, window.location.href);
  };
  
  const onFinish = async (values) => {
    console.log('Valores del formulario de login:', values);
    setLoading(true);
    
    try {
      const response = await authService.login(values.email, values.password);
      
      if (response.requireMFA) {
        setMfaEmail(response.email);
        setShowMFAModal(true);
        setLoading(false);
        return;
      }
      
      console.log('Login exitoso:', response);
      message.success('Inicio de sesión exitoso');
      
      const user = authService.getCurrentUser();
      
      if (!user.mfaEnabled) {
        navigate('/setup-mfa');
      } else {
        if (user.role === 'administrador') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error('Correo electrónico o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMFASubmit = async () => {
    try {
      setLoading(true);
      const values = await mfaForm.validateFields();
      
      const response = await authService.validateMFA(mfaEmail, values.mfaToken);
      
      console.log('MFA exitoso:', response);
      message.success('Verificación exitosa');
      setShowMFAModal(false);
      
      const user = authService.getCurrentUser();
      if (user && user.role === 'administrador') {
        navigate('/admin'); 
      } else {
        navigate('/home'); 
      }
    } catch (error) {
      console.error('Error en verificación MFA:', error);
      message.error('Código inválido');
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  return (
    <>
      <Form
        form={form}
        name="login"
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
        
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>
        
        <Form.Item>
          <FormButton 
            text="Iniciar sesión" 
            loading={loading}
          />
        </Form.Item>
        
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <Link onClick={handleForgotPassword}>¿Olvidaste tu contraseña?</Link>
          </div>
          <Link href="/register">Registrarme</Link>
        </div>
      </Form>
      
      <Modal
        title="Verificación de dos factores"
        open={showMFAModal}
        onCancel={() => setShowMFAModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={mfaForm}
          layout="vertical"
          onFinish={handleMFASubmit}
        >
          <Text style={{ display: 'block', marginBottom: '20px' }}>
            Ingresa el código de verificación generado por la aplicación Google Authenticator.
          </Text>
          
          <Form.Item
            name="mfaToken"
            rules={[
              { required: true, message: 'Por favor ingresa el código de verificación' },
              { len: 6, message: 'El código debe tener 6 dígitos' }
            ]}
          >
            <Input placeholder="Código de verificación" maxLength={6} />
          </Form.Item>
          
          <Form.Item>
            <FormButton 
              text="Verificar" 
              loading={loading}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LoginForm;