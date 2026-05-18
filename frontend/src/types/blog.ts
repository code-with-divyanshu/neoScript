export type UserRole = "reader" | "author" | "admin";

export interface BlogAuthor {
  _id: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  role?: UserRole;
}

export interface Blog {
  _id: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  featureImage: string;
  category: string;
  slug: string;
  aiSummary?: string;
  author: string | BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPayload {
  title: string;
  description: string;
  content: string;
  category: string;
  featureImage: File;
}

export interface AiSuggestionResponse {
  message: string;
  suggestion: string;
}

export interface CreateBlogResponse {
  message: string;
  blog: Blog;
}

export interface UploadContentImageResponse {
  message: string;
  url: string;
}
