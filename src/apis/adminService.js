import api from "./axiosClient";

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  // Get all users with filters
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    const response = await api.get("/admin", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Get user by ID
  async getUserById(userId) {
    const response = await api.get(`/admin/${userId}`);
    return response.data;
  },

  // Update user role
  async updateUserRole(userId, role) {
    const response = await api.patch(`/admin/${userId}/role`, { role });
    return response.data;
  },

  // Delete user account
  async deleteUser(userId) {
    const response = await api.delete(`/admin/${userId}`);
    return response.data;
  },

  // Get all tours
  async getAllTours(page = 1, limit = 10, filters = {}) {
    const response = await api.get("/tours", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Get recent activity/logs
  async getRecentActivity(limit = 10) {
    const response = await api.get("/admin/activity", {
      params: { limit },
    });
    return response.data;
  },

  // Get system analytics
  async getAnalytics(startDate, endDate) {
    const response = await api.get("/admin/analytics", {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default adminService;
