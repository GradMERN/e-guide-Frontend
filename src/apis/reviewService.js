import axiosClient from "./axiosClient";

const reviewService = {
  // Get reviews for a tour
  getTourReviews: async (tourId) => {
    const response = await axiosClient.get(`/tours/${tourId}/reviews`);
    return response.data;
  },

  // Get all reviews (optionally filtered)
  getReviews: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const response = await axiosClient.get(`/reviews?${params}`);
    return response.data;
  },

  // Create a review for a tour
  createReview: async (tourId, reviewData) => {
    const response = await axiosClient.post(
      `/tours/${tourId}/reviews`,
      reviewData
    );
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await axiosClient.patch(
      `/reviews/${reviewId}`,
      reviewData
    );
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await axiosClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewService;
