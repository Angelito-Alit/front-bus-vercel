import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import FormButton from './UI/FormButton';
import authService from '../services/authService';

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
      
      console.log('Login exitoso:', response);
      message.success('Inicio de sesión exitoso');
      const user = authService.getCurrentUser();
      if (user && user.role === 'administrador') {
        navigate('/admin'); 
      } else {
        navigate('/home'); 
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error('Correo electrónico o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };
  
  return (
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
        <a href="/register">Registrarme</a>
      </div>
    </Form>
  );
};

export default LoginForm;