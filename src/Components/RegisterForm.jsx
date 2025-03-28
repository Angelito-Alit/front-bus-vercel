import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import FormButton from './UI/FormButton';
import authService from '../services/authService';

const RegisterForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject('Por favor ingresa tu contraseña');
    }
    
    if (value.length < 8) {
      return Promise.reject('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(value)) {
      return Promise.reject('La contraseña debe incluir al menos una letra mayúscula');
    }
    
    if (!/[a-z]/.test(value)) {
      return Promise.reject('La contraseña debe incluir al menos una letra minúscula');
    }
    
    if (!/[0-9]/.test(value)) {
      return Promise.reject('La contraseña debe incluir al menos un número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject('La contraseña debe incluir al menos un carácter especial (!@#$%^&*(),.?":{}|<>)');
    }
    
    return Promise.resolve();
  };
  
  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      const response = await authService.register({
        nombre: values.nombre,
        email: values.email,
        password: values.password
      });
      
      message.success('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error al registrarse:', error);
      message.error(error.message || 'Error al registrarse. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
    >
      <Form.Item
        name="nombre"
        rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
      >
        <Input placeholder="Nombre" />
      </Form.Item>
      
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
        rules={[
          { required: true, message: 'Por favor ingresa tu contraseña' },
          { validator: validatePassword }
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Contraseña" />
      </Form.Item>
      
      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
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
          text="Registrarme" 
          loading={loading}
        />
      </Form.Item>
      
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <a href="/login">Ya tengo una cuenta</a>
      </div>
    </Form>
  );
};

export default RegisterForm;