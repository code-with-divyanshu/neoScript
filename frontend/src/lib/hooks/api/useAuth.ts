import { useMutation } from "@tanstack/react-query";
import { useStore } from "../../store";
import { loginUser, logoutUser, signupUser } from "../../api/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
    retry: false,
    onSuccess: () => {
      toast.success("Signup successful! Please login.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again.",
      );
    },
  });
};

export const useLogin = () => {
  const { login } = useStore((state) => state);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response: any) => {
      toast.success("Login successful!");
      login(response?.data?.user, response?.data?.token ?? "");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { toggleLoading, logout } = useStore();
  return useMutation({
    mutationFn: logoutUser,
    retry: false,
    onMutate: () => {
      toggleLoading(true);
    },
    onSuccess: () => {
      logout();
      toast.success("Logout successful!");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Logout failed. Please try again.",
      );
    },
  });
};
