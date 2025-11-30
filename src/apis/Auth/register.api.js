import axiosClient from "../axiosClient";

export const register = async (data) => {
  const response = await axiosClient.post("/auth/register", data);
  return response;
};
