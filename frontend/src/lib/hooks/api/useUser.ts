import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../../api/user.api";

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await getUserDetails();
      return res.data.user;
    },
  });
};
