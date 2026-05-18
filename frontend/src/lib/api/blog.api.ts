import { api } from "../axios";

export const createBlog = async (payload: FormData) => {
  return api.post("/blog/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAiSuggestion = async (partialContent: string) => {
  return api.post("/blog/ai-suggestion", { partialContent });
};

export const uploadContentImage = async (file: File) => {
  const payload = new FormData();
  payload.append("file", file);

  return api.post("/upload/content-image", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBlogs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) => {
  return api.get("/blog", { params });
};

export const getBlogDetails = async (id: string) => {
  return api.get(`/blog/${id}`);
};

export const updateBlog = async (id: string, payload: FormData) => {
  return api.put(`/blog/edit/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBlog = async (id: string) => {
  return api.delete(`/blog/delete/${id}`);
};

export const toggleLikeBlog = async (id: string) => {
  return api.patch(`/blog/like/${id}`);
};
