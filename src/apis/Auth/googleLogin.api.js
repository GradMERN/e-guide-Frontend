import axiosClient from "../axiosClient";

export const googlelogin = async (data) => {
  const response = await axiosClient.get("/auth/google", data);
  return response;
};
