// src/Layouts/MainLayout.jsx
import React from 'react';
import { Layout } from 'antd';
import AppHeader from './Header';
import AppFooter from './Footer';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '0 50px', backgroundColor: '#E8F0F2' }}>
        <div className="site-layout-content" style={{ padding: '24px 0' }}>
          {children}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;