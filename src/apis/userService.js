import api from "./axiosClient";

export const userService = {
  async getProfile() {
    const response = await api.get("/user/profile");
    return response.data;
  },

  async getUserStats() {
    const response = await api.get("/user/stats");
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.patch("/user/profile", userData);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.put("/user/change-password", passwordData);
    return response.data;
  },

  async setPassword(passwordData) {
    const response = await api.put("/user/set-password", passwordData);
    return response.data;
  },

  async deactivateAccount() {
    const response = await api.put("/user/deactivate-account");
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get("/admin");
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.patch(`/admin/${id}/role`, { role });
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/${id}`);
    return response.data;
  },
};

export default userService;
