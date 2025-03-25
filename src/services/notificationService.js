import api from './api';

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  connectToSSE: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let eventSource = null;

    const connect = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/notifications/connect-sse/${token}`);
      
      eventSource.onopen = () => {
        console.log('SSE connection established');
        reconnectAttempts = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          const notificationEvent = new CustomEvent('newNotification', { 
            detail: notification 
          });
          window.dispatchEvent(notificationEvent);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close();
        
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const timeout = Math.pow(2, reconnectAttempts) * 1000;
          
          setTimeout(() => {
            console.log(`Intentando reconectar SSE (Intento ${reconnectAttempts})...`);
            connect();
          }, timeout);
        } else {
          console.error('Máximo de intentos de reconexión alcanzado');
        }
      };

      return eventSource;
    };

    return connect();
  },
  
  disconnect: (eventSource) => {
    if (eventSource) {
      eventSource.close();
    }
  }
};

export default notificationService;