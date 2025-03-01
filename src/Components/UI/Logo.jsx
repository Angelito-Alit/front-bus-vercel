
import React from 'react';
import busImage from './bus.png';

const Logo = ({ size = 'medium' }) => {
  const dimensions = {
    small: { width: 100 },
    medium: { width: 150 },
    large: { width: 200 }
  };

  return (
    <div className="logo-container" style={{ textAlign: 'center' }}>
      <img 
        src={busImage} 
        alt="Bus Seat Manager Logo" 
        style={{ width: dimensions[size].width }}
      />
    </div>
  );
};

export default Logo;
