import api from "./axiosClient";

export const guideService = {
  // Get guide's dashboard statistics
  async getDashboardStats() {
    const response = await api.get("/tours/guide-stats");
    return response.data;
  },

  // Get guide's tours
  async getMyTours(page = 1, limit = 10, filters = {}) {
    const response = await api.get("/tours/my-tours", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Get guide's bookings/enrollments
  async getMyBookings(page = 1, limit = 10) {
    const response = await api.get("/enrollments/guide-bookings", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get guide's earnings
  async getEarnings(startDate, endDate) {
    const response = await api.get("/payments/guide-earnings", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get guide's reviews/ratings
  async getReviews(limit = 10) {
    const response = await api.get("/tours/my-reviews", {
      params: { limit },
    });
    return response.data;
  },

  // Get guide's analytics
  async getAnalytics(startDate, endDate) {
    const response = await api.get("/tours/guide-analytics", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get single tour by id
  async getTour(tourId) {
    const response = await api.get(`/tours/${tourId}`);
    return response.data;
  },

  // Create new tour
  async createTour(tourData) {
    const formData = new FormData();

    // Add text fields
    Object.keys(tourData).forEach((key) => {
      if (key !== "mainImage" && key !== "galleryImages") {
        if (Array.isArray(tourData[key])) {
          // For arrays, send as JSON string
          formData.append(key, JSON.stringify(tourData[key]));
        } else if (
          tourData[key] !== null &&
          tourData[key] !== undefined &&
          tourData[key] !== ""
        ) {
          // Only add non-empty values
          formData.append(key, String(tourData[key]));
        }
      }
    });

    // Add files
    if (tourData.mainImage) {
      formData.append("mainImage", tourData.mainImage);
    }
    if (tourData.galleryImages && tourData.galleryImages.length > 0) {
      tourData.galleryImages.forEach((img) => {
        formData.append("galleryImages", img);
      });
    }

    try {
      const response = await api.post("/tours", formData);
      return response.data;
    } catch (error) {
      console.error(
        "Tour creation failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update tour
  async updateTour(tourId, tourData) {
    const formData = new FormData();

    // Add text fields
    Object.keys(tourData).forEach((key) => {
      if (key !== "mainImage" && key !== "galleryImages") {
        const value = tourData[key];
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      }
    });

    // Add files
    if (tourData.mainImage) {
      formData.append("mainImage", tourData.mainImage);
    }

    if (tourData.galleryImages && tourData.galleryImages.length > 0) {
      tourData.galleryImages.forEach((img) => {
        formData.append("galleryImages", img);
      });
    }

    try {
      const response = await api.patch(`/tours/${tourId}`, formData);
      return response.data;
    } catch (error) {
      console.error(
        `Tour update failed for ${tourId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Publish or unpublish tour. Pass an object like { isPublished: true|false } to set explicitly.
  async publishTour(tourId, payload = {}) {
    try {
      // Ensure Authorization header is present for this request in case interceptor fails
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await api.put(
        `/tours/${tourId}/publish`,
        payload,
        config
      );
      return response.data;
    } catch (error) {
      console.error(
        `Publish tour failed for ${tourId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete tour
  async deleteTour(tourId) {
    const response = await api.delete(`/tours/${tourId}`);
    return response.data;
  },

  // Update only gallery images of a tour
  async updateTourGalleryImages(tourId, newImages = [], deletedPublicIds = []) {
    const formData = new FormData();
    // Add new images
    if (newImages && newImages.length > 0) {
      newImages.forEach((img) => {
        formData.append("galleryImages", img);
      });
    }
    // Add deleted public IDs
    if (deletedPublicIds && deletedPublicIds.length > 0) {
      formData.append("deletedGallaryImages", JSON.stringify(deletedPublicIds));
    }
    try {
      const response = await api.patch(`/tours/${tourId}`, formData);
      return response.data;
    } catch (error) {
      console.error(
        "Update gallery images failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ==================== PUBLIC GUIDE ENDPOINTS ====================

  // Get featured guides for homepage (public, no auth required)
  async getFeaturedGuides(limit = 6) {
    const response = await api.get("/public/guides/featured", {
      params: { limit },
    });
    return response.data;
  },

  // Get guide public profile by ID (public, no auth required)
  async getGuideProfile(guideId) {
    const response = await api.get(`/public/guides/${guideId}`);
    return response.data;
  },

  // Get all public guides (for listing)
  async getAllGuides(limit = 20) {
    const response = await api.get("/public/guides/featured", {
      params: { limit },
    });
    return response.data;
  },
};

export default guideService;
