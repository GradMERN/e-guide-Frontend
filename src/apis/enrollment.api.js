import axiosClient from "./axiosClient";

const enrollmentApi = {
  // Create enrollment for a tour
  enrollTour: (tourId) => {
    const url = `/enrollments/${tourId}/enroll`;
    return axiosClient.post(url);
  },

  // Get user enrollments
  getUserEnrollments: () => {
    const url = `/enrollments`;
    return axiosClient.get(url);
  },
  // Start an active enrollment
  startEnrollment: (enrollmentId) => {
    const url = `/enrollments/${enrollmentId}/start`;
    return axiosClient.post(url);
  },
};

export default enrollmentApi;
