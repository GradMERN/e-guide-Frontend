import axiosClient from "./axiosClient";

const paymentApi = {
  // Initialize payment via enrollmentId (returns checkoutUrl)
  initializePayment: (enrollmentId) => {
    const url = `/payments/initialize/${enrollmentId}`;
    return axiosClient.post(url);
  },

  // Confirm payment via sessionId
  confirmPayment: (sessionId) => {
    const url = `/payments/confirm/${sessionId}`;
    return axiosClient.post(url);
  },
};

export default paymentApi;
