import api from './api';

const tripService = {
  getAllTrips: async () => {
    return await api.get('/routes');
  },

  getTripById: async (id) => {
    return await api.get(`/routes/${id}`);
  },

  getAvailableSeats: async (routeId) => {
    return await api.get(`/routes/${routeId}/seats`);
  },

  createTrip: async (tripData) => {
    return await api.post('/routes', tripData);
  },

  updateTrip: async (id, tripData) => {
    return await api.put(`/routes/${id}`, tripData);
  },

  deleteTrip: async (id) => {
    return await api.delete(`/routes/${id}`);
  }
};

export default tripService;