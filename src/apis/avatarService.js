import axiosClient from "./axiosClient";

export const avatarService = {
  // Upload user avatar
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return axiosClient.post("/api/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete user avatar
  deleteAvatar: () => axiosClient.delete("/api/user/avatar"),
};
