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
      // add a short cache-buster to avoid browser returning 304 (empty body)
      // which caused the frontend to receive no data despite the backend
      // reporting items. This forces a fresh response during development.
      const res = await api.get(`/tours/${tourId}/items`, {
        params: { cb: Date.now() },
        // ask intermediaries and browser to revalidate instead of returning stale 304
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        // accept 304 so we can explicitly handle it rather than throwing
        validateStatus: (status) => status === 200 || status === 304,
      });

      // If we got 304 (Not Modified) some environments may not include a body.
      // Retry once with a stronger cache-buster to force a full response.
      if (res.status === 304) {
        const retry = await api.get(`/tours/${tourId}/items`, {
          params: { cb: Date.now(), force: true },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });
        return retry?.data?.data || [];
      }

      return res?.data?.data || [];
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
