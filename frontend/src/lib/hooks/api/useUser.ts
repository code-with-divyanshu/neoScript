import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserDetails, updateUserProfile } from "../../api/user.api";
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
