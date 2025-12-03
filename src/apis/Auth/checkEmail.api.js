import axiosClient from "../axiosClient";

export const checkEmail = async (email) => {
  const response = await axiosClient.post("/auth/check-email", { email });
  return response;
};
