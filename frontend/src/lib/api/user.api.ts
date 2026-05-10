import { api } from "../axios";

export const getUserDetails = async () => {
  return api.get("/user/me");
};

export const updateUserProfile = async (payload: any) => {
  return api.put("/user/update-profile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changeUserPassword = async (payload: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  return api.post("/user/change-password", payload);
};

export const getAllUsers = async () => {
  return api.get("/user/admin/users");
};

export const updateUserRole = async (userId: string, newRole: string) => {
  return api.put(`/user/admin/users/${userId}/role`, { role: newRole });
};
