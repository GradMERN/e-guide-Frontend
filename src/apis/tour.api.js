import axiosClient from "./axiosClient";

const tourApi = {
  // Get all tours with optional query parameters
  getAllTours: (params = {}) => {
    const url = "/tours";
    return axiosClient.get(url, { params });
  },

  // Get single tour by ID
  getTourById: (id) => {
    const url = `/tours/${id}`;
    return axiosClient.get(url);
  },

  // Get featured tours (for homepage/hero)
  getFeaturedTours: () => {
    const url = "/tours/featured";
    return axiosClient.get(url);
  },

  // Get popular tours
  getPopularTours: (limit = 6) => {
    const url = "/tours/popular";
    return axiosClient.get(url, { params: { limit } });
  },

  // Get tours by category
  getToursByCategory: (category) => {
    const url = `/tours/category/${category}`;
    return axiosClient.get(url);
  },

  // Get tours by location (city)
  getToursByCity: (city) => {
    const url = `/tours/location/${city}`;
    return axiosClient.get(url);
  },

  // Search tours (if your backend has search endpoint)
  searchTours: (searchParams) => {
    const url = "/tours/search";
    return axiosClient.get(url, { params: searchParams });
  },
};

export default tourApi;
