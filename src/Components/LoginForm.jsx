
import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import FormButton from './UI/FormButton';
import authService from '../services/authService';

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    console.log('Valores del formulario de login:', values);
    setLoading(true);
    
    try {
      const response = await authService.login({
        email: values.email,
        password: values.password
      });
      
      console.log('Login exitoso:', response);
      message.success('Inicio de sesión exitoso');
      navigate('/home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error(error.message || 'Correo electrónico o contraseña incorrectos');
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