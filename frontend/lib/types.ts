export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  coverImage?: string;
  author: User;
  tags?: string[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  image?: string;
  tags: string[];
}

export interface ApiError {
  message: string;
  field?: string;
}


