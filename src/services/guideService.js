import api from './api';

export const guideService = {
  // Get guide's dashboard statistics
  async getDashboardStats() {
    const response = await api.get('/tours/guide-stats');
    return response.data;
  },

  // Get guide's tours
  async getMyTours(page = 1, limit = 10, filters = {}) {
    const response = await api.get('/tours/my-tours', {
      params: { page, limit, ...filters }
    });
    return response.data;
  },

  // Get guide's bookings/enrollments
  async getMyBookings(page = 1, limit = 10) {
    const response = await api.get('/enrollments/guide-bookings', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get guide's earnings
  async getEarnings(startDate, endDate) {
    const response = await api.get('/payments/guide-earnings', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get guide's reviews/ratings
  async getReviews(limit = 10) {
    const response = await api.get('/tours/my-reviews', {
      params: { limit }
    });
    return response.data;
  },

  // Get guide's analytics
  async getAnalytics(startDate, endDate) {
    const response = await api.get('/tours/guide-analytics', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Create new tour
  async createTour(tourData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(tourData).forEach(key => {
      if (key !== 'mainImage' && key !== 'galleryImages') {
        if (Array.isArray(tourData[key])) {
          // For arrays, send as JSON string
          formData.append(key, JSON.stringify(tourData[key]));
        } else if (tourData[key] !== null && tourData[key] !== undefined && tourData[key] !== '') {
          // Only add non-empty values
          formData.append(key, String(tourData[key]));
        }
      }
    });

    // Add files
    if (tourData.mainImage) {
      formData.append('mainImage', tourData.mainImage);
    }
    if (tourData.galleryImages && tourData.galleryImages.length > 0) {
      tourData.galleryImages.forEach((img, idx) => {
        formData.append('galleryImages', img);
      });
    }

    try {
      console.log('Creating tour with data:', tourData);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      // Don't set Content-Type header - let Axios set it automatically
      // Axios will automatically set Content-Type: multipart/form-data with boundary
      const response = await api.post('/tours', formData);
      return response.data;
    } catch (error) {
      console.error('Tour creation failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update tour
  async updateTour(tourId, tourData) {
    const formData = new FormData();
    
    Object.keys(tourData).forEach(key => {
      if (key !== 'mainImage' && key !== 'galleryImages') {
        if (Array.isArray(tourData[key])) {
          formData.append(key, JSON.stringify(tourData[key]));
        } else {
          formData.append(key, tourData[key]);
        }
      }
    });

    if (tourData.mainImage) {
      formData.append('mainImage', tourData.mainImage);
    }
    if (tourData.galleryImages && tourData.galleryImages.length > 0) {
      tourData.galleryImages.forEach((img) => {
        formData.append('galleryImages', img);
      });
    }

    const response = await api.patch(`/tours/${tourId}`, formData);
    return response.data;
  },

  // Publish tour
  async publishTour(tourId) {
    const response = await api.put(`/tours/${tourId}/publish`);
    return response.data;
  },

  // Delete tour
  async deleteTour(tourId) {
    const response = await api.delete(`/tours/${tourId}`);
    return response.data;
  }
};

