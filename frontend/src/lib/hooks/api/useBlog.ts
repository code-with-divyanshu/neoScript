import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlog,
  deleteBlog,
  getAiSuggestion,
  getBlogDetails,
  getBlogs,
  toggleLikeBlog,
  updateBlog,
  uploadContentImage,
} from "../../api/blog.api";
import toast from "react-hot-toast";

export const useCreateBlog = () => {
  const resetDraft = useStore((state) => state.resetDraft);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Blog created Successfully");
      resetDraft();
      navigate("/blogs");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create blog");
    },
  });
};

export const useAiSuggestion = () => {
  const setDraftField = useStore((state) => state.setDraftField);

  return useMutation({
    mutationFn: getAiSuggestion,
    onSuccess: (response) => {
      setDraftField("aiSuggestion", response?.data?.suggestion || "");
      toast.success("Suggestion generated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to get suggestion");
    },
  });
};

export const useUploadContentImage = () => {
  return useMutation({
    mutationFn: uploadContentImage,
    onSuccess: () => {
      toast.success("Image uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Image upload failed");
    },
  });
};

export const useGetBlogs = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: async () => {
      const response = await getBlogs(params);
      return response.data;
    },
  });
};

export const useGetBlogDetails = (id: string) => {
  return useQuery({
    queryKey: ["blog-details", id],
    queryFn: async () => {
      const res = await getBlogDetails(id as string);
      return res.data.blog;
    },
    enabled: !!id,
  });
};

export const useUpdateBlog = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      updateBlog(id, payload),
    onSuccess: (response, variables) => {
      toast.success(response?.data?.message || "Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/blogs");
      queryClient.invalidateQueries({
        queryKey: ["blog-details", variables.id],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update blog");
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete blog");
    },
  });
};

export const useToggleLikeBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleLikeBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-details"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to like/unlike blog",
      );
    },
  });
};
