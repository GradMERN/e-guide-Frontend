import api from './api';

export const placeService = {
  // Get all places
  async getAllPlaces() {
    try {
      const response = await api.get('/places');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
  },

  // Get place by ID
  async getPlaceById(id) {
    try {
      const response = await api.get(`/places/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching place:', error);
      return null;
    }
  },

  // Create a new place (admin only)
  async createPlace(placeData) {
    try {
      const response = await api.post('/places', placeData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating place:', error);
      throw error;
    }
  },

  // Get places by city
  async getPlacesByCity(city) {
    try {
      const response = await api.get('/places', {
        params: { city }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching places by city:', error);
      return [];
    }
  }
};
