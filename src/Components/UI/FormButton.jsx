// src/Components/UI/FormButton.jsx
import React from 'react';
import { Button } from 'antd';

const FormButton = ({ 
  text, 
  type = "primary", 
  onClick, 
  loading = false, 
  style = {}, 
  danger = false 
}) => {
  
  const buttonStyle = danger 
    ? { backgroundColor: '#A20025', borderColor: '#A20025', ...style } 
    : type === 'primary' 
      ? { backgroundColor: '#007BFF', borderColor: '#007BFF', ...style }
      : { backgroundColor: '#F9F7ED', borderColor: '#F9F7ED', color: '#004D61', ...style };
  
  return (
    <Button 
      type={type} 
      onClick={onClick} 
      loading={loading}
      style={buttonStyle}
      htmlType={onClick ? "button" : "submit"}
      block
    >
      {text}
    </Button>
  );
};

export default FormButton;