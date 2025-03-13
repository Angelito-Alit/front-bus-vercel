import api from './api';

const mercadoPagoService = {
  createPreference: async (routeId, asientoNumero) => {
    try {
      const response = await api.post('/mercadopago/create-preference', {
        routeId,
        asientoNumero
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mercadoPagoService;