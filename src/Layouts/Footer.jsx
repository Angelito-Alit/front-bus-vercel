
import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', backgroundColor: '#004D61', color: 'white', padding: '20px' }}>
      Bus Seat Manager ©{new Date().getFullYear()} 
    </Footer>
  );
};

export default AppFooter;