import api from './api';

export const tourService = {
  async getAllTours(params = {}) {
    const response = await api.get('/tours', { params });
    return response.data;
  },

  async getTourById(id) {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  async createTour(tourData) {
    const response = await api.post('/tours', tourData);
    return response.data;
  },

  async updateTour(id, tourData) {
    const response = await api.patch(`/tours/${id}`, tourData);
    return response.data;
  },

  async deleteTour(id) {
    const response = await api.delete(`/tours/${id}`);
    return response.data;
  },

  async getToursByGuide(guideId) {
    const response = await api.get(`/tours/guide/${guideId}`);
    return response.data;
  },

  async getToursByCity(city) {
    const response = await api.get(`/tours/city/${city}`);
    return response.data;
  },
};

export default tourService;