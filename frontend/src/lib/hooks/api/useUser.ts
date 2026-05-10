import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeUserPassword,
  getAllUsers,
  getUserDetails,
  updateUserProfile,
  updateUserRole,
} from "../../api/user.api";
import { useStore } from "../../store";
import { toast } from "react-hot-toast";

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await getUserDetails();
      return res.data.user;
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { login, token } = useStore((state) => state);

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (response: any) => {
      const updatedUser = response?.data?.user;
      toast.success("Profile updated successfully");
      if (updatedUser) {
        login(updatedUser, token ?? "");
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Profile update failed.");
    },
  });
};

export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: changeUserPassword,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Password change failed.");
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await getAllUsers();
      return res.data.users;
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update user role.",
      );
    },
  });
};
