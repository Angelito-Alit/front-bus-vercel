import React, { useState, useEffect, useRef } from 'react';
import { 
  Badge, 
  Dropdown, 
  Button, 
  List, 
  Typography, 
  Empty,
  notification
} from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import notificationService from '../services/notificationService';
import authService from '../services/authService';

const { Text } = Typography;

notification.config({
  placement: 'topLeft',
  top: 70,
  duration: 4
});

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const eventSourceRef = useRef(null);
  const sessionStarted = useRef(false);

  const filterNotifications = (notifs) => {
    return notifs.filter(notif => 
      notif.mensaje && notif.mensaje.includes('Inicio de sesión exitoso')
    );
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Fecha no disponible";
      }
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return "Fecha no disponible";
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated() && !sessionStarted.current) {
      sessionStarted.current = true; 
      fetchNotifications();
      connectToSSE();
      
      const handleNewNotification = (event) => {
        const notification = event.detail;
        if (notification.mensaje && notification.mensaje.includes('Inicio de sesión exitoso')) {
          setNotifications(prev => [notification, ...prev]);
          showNotification(notification);
        }
      };

      window.addEventListener('newNotification', handleNewNotification);
      return () => {
        window.removeEventListener('newNotification', handleNewNotification);
        disconnectSSE();
      };
    }
  }, []);

  const showNotification = (notif) => {
    if (notif.mensaje && notif.mensaje.includes('Inicio de sesión exitoso')) {
      notification.success({
        message: 'Inicio de sesión exitoso',
        description: 'Has iniciado sesión correctamente',
        placement: 'topLeft'
      });
    }
  };

  const connectToSSE = () => {
    try {
      setConnectionStatus('connecting');
      const source = notificationService.connectToSSE();
      
      if (source) {
        source.onopen = () => {
          setConnectionStatus('connected');
        };
        eventSourceRef.current = source;
      }
    } catch (error) {
      console.error('Error al conectar SSE:', error);
      setConnectionStatus('error');
    }
  };

  const disconnectSSE = () => {
    if (eventSourceRef.current) {
      notificationService.disconnect(eventSourceRef.current);
      eventSourceRef.current = null;
      setConnectionStatus('disconnected');
    }
  };

  const fetchNotifications = async () => {
    if (!authService.isAuthenticated()) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(filterNotifications(data));
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.filter(notification => notification._id !== id)
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const notificationContent = (
    <div style={{ 
      width: 300, 
      maxHeight: 400, 
      overflowY: 'auto',
      background: '#fff',
      boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      borderRadius: '4px'
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Notificaciones</Text>
        {connectionStatus === 'connected' && (
          <Badge status="success" text="Conectado" style={{ fontSize: '12px' }} />
        )}
      </div>
      
      {notifications.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="No tienes notificaciones" 
          style={{ margin: '30px 0' }} 
        />
      ) : (
        <List
          loading={loading}
          dataSource={notifications}
          renderItem={item => (
            <List.Item
              style={{ padding: '12px 16px', cursor: 'default' }}
              actions={[
                <Button 
                  type="text"
                  icon={<CheckOutlined />}
                  size="small"
                  onClick={() => handleMarkAsRead(item._id)}
                />
              ]}
            >
              <List.Item.Meta
                avatar={<span style={{ color: '#52c41a', marginRight: 8 }}>✓</span>}
                title={<Text style={{ fontSize: '14px' }}>Inicio de sesión exitoso</Text>}
                description={
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {formatDate(item.createdAt)}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown 
      dropdownRender={() => notificationContent}
      trigger={['click']}
      placement="bottomRight"
      arrow
    >
      <Badge count={notifications.length} size="small">
        <Button 
          type="text" 
          icon={<BellOutlined style={{ fontSize: '20px', color: '#fff' }} />}
          style={{ padding: '8px' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationCenter;
