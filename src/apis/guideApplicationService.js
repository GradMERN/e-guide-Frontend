import axiosClient from "./axiosClient";

const API_BASE_URL = "/guide-applications";

export const guideApplicationService = {
  // Submit a guide application with optional files (certificates and documents)
  // backgroundData: { experience, languages, specialties, bio }
  // files: { certificates: File[], documents: File[] } (both optional)
  submitApplication: (backgroundData, files = {}) => {
    const formData = new FormData();

    // Add background data as JSON string
    formData.append("background", JSON.stringify(backgroundData));

    // Add certificate files if provided (optional)
    if (files.certificates && files.certificates.length > 0) {
      files.certificates.forEach((file) => {
        formData.append("certificates", file);
      });
    }

    // Add document files if provided (optional)
    if (files.documents && files.documents.length > 0) {
      files.documents.forEach((file) => {
        formData.append("documents", file);
      });
    }

    return axiosClient.post(`${API_BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get user's application
  getMyApplication: () => axiosClient.get(`${API_BASE_URL}/me`),

  // Update guide profile (for approved guides)
  updateGuideProfile: (backgroundData) =>
    axiosClient.patch(`${API_BASE_URL}/profile`, {
      background: backgroundData,
    }),

  // Delete certificate
  deleteCertificate: (certificateId) =>
    axiosClient.delete(`${API_BASE_URL}/certificates/${certificateId}`),

  // Admin: Get all applications
  getAllApplications: (status, page = 1, limit = 10) =>
    axiosClient.get(`${API_BASE_URL}`, {
      params: { status, page, limit },
    }),

  // Admin: Get application stats
  getApplicationStats: () => axiosClient.get(`${API_BASE_URL}/stats`),

  // Admin: Get single application
  getApplicationById: (id) => axiosClient.get(`${API_BASE_URL}/${id}`),

  // Admin: Schedule interview
  scheduleInterview: (id, scheduledDate, scheduledTime, timezone) =>
    axiosClient.patch(`${API_BASE_URL}/${id}/schedule-interview`, {
      scheduledDate,
      scheduledTime,
      timezone,
    }),

  // Admin: Approve application
  approveApplication: (id, notes = "") =>
    axiosClient.patch(`${API_BASE_URL}/${id}/approve`, {
      notes,
    }),

  // Admin: Reject application
  rejectApplication: (id, reason = "") =>
    axiosClient.patch(`${API_BASE_URL}/${id}/reject`, {
      reason,
    }),
};
