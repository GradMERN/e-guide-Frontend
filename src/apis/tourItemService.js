import api from "./axiosClient";

export const tourItemService = {
  async getContentTypes() {
    try {
      const res = await api.get(`/tours/items/content-types`);
      return res.data.data || [];
    } catch (err) {
      console.error("Error getting content types", err);
      throw err;
    }
  },

  async getTourItems(tourId) {
    try {
      const res = await api.get(`/tours/${tourId}/items`);
      return res.data.data || [];
    } catch (err) {
      console.error("Error getting tour items", err);
      throw err;
    }
  },

  async getTourItem(tourId, itemId) {
    try {
      const res = await api.get(`/tours/${tourId}/items/${itemId}`);
      return res.data.data;
    } catch (err) {
      console.error("Error getting tour item", err);
      throw err;
    }
  },

  async createTourItem(tourId, payload) {
    try {
      // payload is expected to be a FormData or plain object; prefer FormData when files
      const isForm = payload instanceof FormData;
      if (isForm) {
        const res = await api.post(`/tours/${tourId}/items`, payload);
        return res.data.data;
      }
      const res = await api.post(`/tours/${tourId}/items`, payload);
      return res.data.data;
    } catch (err) {
      console.error("Error creating tour item", err);
      throw err;
    }
  },

  async updateTourItem(tourId, itemId, payload) {
    try {
      const isForm = payload instanceof FormData;
      if (isForm) {
        const res = await api.patch(
          `/tours/${tourId}/items/${itemId}`,
          payload
        );
        return res.data.data;
      }
      const res = await api.patch(`/tours/${tourId}/items/${itemId}`, payload);
      return res.data.data;
    } catch (err) {
      console.error("Error updating tour item", err);
      throw err;
    }
  },

  async deleteTourItem(tourId, itemId) {
    try {
      const res = await api.delete(`/tours/${tourId}/items/${itemId}`);
      return res.data;
    } catch (err) {
      console.error("Error deleting tour item", err);
      throw err;
    }
  },
  async publishTourItem(tourId, itemId, payload) {
    try {
      const res = await api.put(
        `/tours/${tourId}/items/${itemId}/publish`,
        payload
      );
      return res.data.data;
    } catch (err) {
      console.error("Error publishing tour item", err);
      throw err;
    }
  },
};

export default tourItemService;
