import api from './api';

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  },
  
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  },
  
  connectToSSE: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found. Cannot establish SSE connection.');
      return null;
    }

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10; 
    const initialBackoffTime = 1000; 
    let eventSource = null;
    let reconnectTimeout = null;
    let isConnecting = false;
    const eventHandlers = {};
    
    const addListener = (event, handler) => {
      if (!eventHandlers[event]) {
        eventHandlers[event] = [];
      }
      eventHandlers[event].push(handler);
    };
    
    const removeListener = (event, handler) => {
      if (eventHandlers[event]) {
        eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
      }
    };
    
    const triggerEvent = (event, data) => {
      if (eventHandlers[event]) {
        eventHandlers[event].forEach(handler => handler(data));
      }
    };

    const connect = () => {
      if (isConnecting) return;
      isConnecting = true;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }

      if (eventSource) {
        eventSource.close();
      }

      try {
        const timestamp = new Date().getTime();
        const baseUrl = process.env.REACT_APP_API_URL || '';
        const url = `${baseUrl}/notifications/connect-sse/${encodeURIComponent(token)}?t=${timestamp}`;
        
        eventSource = new EventSource(url, { withCredentials: true });
        
        eventSource.onopen = () => {
          console.log('SSE connection established successfully');
          reconnectAttempts = 0;
          isConnecting = false;
          triggerEvent('connected', true);
        };

        eventSource.onmessage = (event) => {
          try {
            const notification = JSON.parse(event.data);
            console.log('New notification received:', notification);
            
            const notificationEvent = new CustomEvent('newNotification', { 
              detail: notification 
            });
            window.dispatchEvent(notificationEvent);
            triggerEvent('notification', notification);
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        };
        
        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          eventSource.close();
          isConnecting = false;
          triggerEvent('error', error);
          
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const baseTimeout = Math.min(30000, initialBackoffTime * Math.pow(2, reconnectAttempts - 1));
            const jitter = Math.random() * 0.3 * baseTimeout;
            const timeout = baseTimeout + jitter;
            
            console.log(`SSE reconnection scheduled in ${Math.round(timeout/1000)}s (Attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            
            reconnectTimeout = setTimeout(() => {
              console.log(`Attempting to reconnect SSE (Attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);
              connect();
            }, timeout);
          } else {
            console.error('Maximum SSE reconnection attempts reached');
            triggerEvent('maxReconnectAttemptsReached', true);
          }
        };
      } catch (e) {
        console.error('Failed to initialize SSE connection:', e);
        isConnecting = false;
        
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const timeout = Math.min(30000, initialBackoffTime * Math.pow(2, reconnectAttempts - 1));
          
          reconnectTimeout = setTimeout(() => {
            connect();
          }, timeout);
        }
      }

      return {
        eventSource,
        on: addListener,
        off: removeListener
      };
    };

    return connect();
  },
  
  disconnect: (connection) => {
    if (connection && connection.eventSource) {
      connection.eventSource.close();
    } else if (typeof connection === 'object' && connection !== null) {
      const eventSource = connection.eventSource || connection;
      if (eventSource && typeof eventSource.close === 'function') {
        eventSource.close();
      }
    }
    
    return true;
  },
  
  isSSESupported: () => {
    return typeof EventSource !== 'undefined';
  },
  
  startPolling: (interval = 30000) => {
    const pollingInterval = Math.max(10000, interval); 
    let timerId = null;
    
    const poll = async () => {
      try {
        const notifications = await notificationService.getNotifications();
        const event = new CustomEvent('polledNotifications', { 
          detail: { notifications } 
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Notification polling failed:', error);
      }
      timerId = setTimeout(poll, pollingInterval);
    };
    poll();
    return {
      stop: () => {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      },
      isPolling: () => timerId !== null
    };
  }
};

export default notificationService;