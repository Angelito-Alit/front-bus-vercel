import React from 'react';
import { Row, Col, Button, Tooltip } from 'antd';

const SeatMap = ({ seats, selectedSeats, onSeatSelect, busCapacity, occupiedSeats = [] }) => {
  const rows = Math.ceil(busCapacity / 4);
  const occupiedSeatsNumbers = occupiedSeats.map(Number);
  const selectedSeatsNumbers = selectedSeats.map(Number);
  
  const renderSeat = (seatNumber) => {
    const isOccupied = occupiedSeatsNumbers.includes(seatNumber);
    const isSelected = selectedSeatsNumbers.includes(seatNumber);
    const baseStyle = {
      margin: '5px',
      width: '40px',
      height: '40px',
      fontWeight: 'bold',
      border: '1px solid #d9d9d9',
    };
    const occupiedStyle = {
      ...baseStyle,
      backgroundColor: '#FF0000',
      color: 'white',
      cursor: 'not-allowed',
    };
    const selectedStyle = {
      ...baseStyle,
      backgroundColor: '#1890ff',
      color: 'white',
      cursor: 'pointer',
      border: '2px solid #1890ff',
    };
    const availableStyle = {
      ...baseStyle,
      backgroundColor: '#004D61',
      color: 'white',
      cursor: 'pointer',
    };
    const buttonStyle = isOccupied ? occupiedStyle : 
                         isSelected ? selectedStyle : 
                         availableStyle;
    
    return (
      <Tooltip title={`Asiento ${seatNumber}${isOccupied ? ' (Ocupado)' : ''}`} key={seatNumber}>
        <button 
          style={buttonStyle}
          disabled={isOccupied}
          onClick={() => !isOccupied && onSeatSelect(seatNumber)}
        >
          {seatNumber}
        </button>
      </Tooltip>
    );
  };

  const renderRow = (rowIndex) => {
    const startSeat = rowIndex * 4 + 1;
    return (
      <Row key={rowIndex} justify="center" gutter={[8, 8]}>
        <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
          {renderSeat(startSeat)}
        </Col>
        <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
          {renderSeat(startSeat + 1)}
        </Col>
        <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
          {renderSeat(startSeat + 2)}
        </Col>
        <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
          {renderSeat(startSeat + 3)}
        </Col>
      </Row>
    );
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <div>
            <div style={{ 
              display: 'inline-block', 
              width: '20px',
              height: '20px',
              backgroundColor: '#004D61',
              marginRight: '8px',
              border: '1px solid #004D61'
            }}></div>
            Disponible
          </div>
          <div>
            <div style={{ 
              display: 'inline-block', 
              width: '20px',
              height: '20px',
              backgroundColor: '#FF0000',
              marginRight: '8px',
              border: '1px solid #d9d9d9'
            }}></div>
            Ocupado
          </div>
          <div>
            <div style={{ 
              display: 'inline-block', 
              width: '20px',
              height: '20px',
              backgroundColor: '#1890ff',
              marginRight: '8px',
              border: '1px solid #d9d9d9'
            }}></div>
            Seleccionado
          </div>
        </div>
      </div>
      
      <div style={{ 
        background: '#004D61', 
        color: 'white', 
        textAlign: 'center', 
        padding: '5px', 
        borderRadius: '5px', 
        marginBottom: '20px' 
      }}>
        Frente del Autobús
      </div>
      
      {Array.from({ length: rows }).map((_, index) => renderRow(index))}
    </div>
  );
};

export default SeatMap;