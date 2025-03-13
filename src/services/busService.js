import api from './api';

const busService = {
  getAllBuses: async () => {
    return await api.get('/buses');
  },

  getBusById: async (id) => {
    return await api.get(`/buses/${id}`);
  },

  createBus: async (busData) => {
    return await api.post('/buses', busData);
  },

  updateBus: async (id, busData) => {
    return await api.put(`/buses/${id}`, busData);
  },

  deleteBus: async (id) => {
    return await api.delete(`/buses/${id}`);
  }
};

export default busService;