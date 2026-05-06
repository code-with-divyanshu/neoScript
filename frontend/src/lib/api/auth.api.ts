import { api } from "../axios";

export const adminSignup = async (payload: any) => {
  return api.post("/auth/admin/signup", payload);
};

export const signupUser = async (payload: any) => {
  return api.post("/auth/signup", payload);
};

export const loginUser = async (payload: any) => {
  return api.post("/auth/login", payload);
};

export const logoutUser = async () => {
  return api.post("/auth/logout");
};
