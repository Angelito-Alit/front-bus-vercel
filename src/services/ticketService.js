import api from './api';

const ticketService = {
  buyTicket: async (ticketData) => {
    return await api.post('/tickets', ticketData);
  },

  getMyTickets: async () => {
    return await api.get('/tickets/my');
  },

  getAllTickets: async () => {
    return await api.get('/tickets');
  },

  verifyTicket: async (code) => {
    return await api.get(`/tickets/verify/${code}`);
  },
  verifyPayment: async (paymentId, routeId, asientoNumero) => {
    return await api.get(`/mercadopago/verify-payment/${paymentId}?routeId=${routeId}&asientoNumero=${asientoNumero}`);
  }
};

export default ticketService;