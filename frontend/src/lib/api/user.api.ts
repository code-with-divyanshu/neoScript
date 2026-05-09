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
