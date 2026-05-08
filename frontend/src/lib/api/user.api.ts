import { api } from "../axios";

export const getUserDetails = async () => {
  return api.get("/user/me");
};
