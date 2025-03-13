import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      backgroundColor: '#004d66', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white'
    }}>
      <Result
        status="404"
        icon={null}
        title={
          <div style={{ 
            position: 'relative',
            margin: '0 auto',
            width: '120px',
            height: '70px'
          }}>
            <svg width="120" height="70" viewBox="0 0 130 90">
              <path 
                d="M30,20 Q40,5 60,10 Q80,0 90,15 Q110,5 120,20 Q130,40 110,50 Q120,70 100,65 Q80,80 60,70 Q40,85 20,70 Q0,65 10,50 Q0,40 30,20" 
                fill="white" 
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '25px'
            }}>
              404
            </div>
          </div>
        }
        subTitle={<div style={{ color: 'white', marginTop: '20px' }}>Página no encontrada</div>}
        extra={
          <Button type="primary" onClick={() => navigate('/home')}>
            Volver al inicio
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;