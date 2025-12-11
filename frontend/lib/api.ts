import axios from 'axios';
import { authUtils } from './auth';
import type { LoginCredentials, RegisterData, CreatePostData } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

export const authApi = {
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  register: (data: RegisterData) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data: { username?: string; email?: string; avatar?: string }) => 
    api.put('/auth/profile', data),
};

export const postsApi = {
  getAll: () => api.get('/posts'),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: CreatePostData) => api.post('/posts', data),
  update: (id: string, data: CreatePostData) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  like: (id: string) => api.post(`/posts/${id}/like`),
  search: (query: string) => api.get(`/posts/search?q=${encodeURIComponent(query)}`),
};

export const uploadsApi = {
  upload: async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);

    // Use fetch for multipart upload so we don't inherit axios default JSON header
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const url = `${base}/uploads`;

    const resp = await fetch(url, {
      method: 'POST',
      body: fd,
      credentials: 'include', // Include cookies for authentication
    });

    if (!resp.ok) {
      const text = await resp.text();
      const err: any = new Error('Upload failed');
      try {
        err.response = { data: JSON.parse(text) };
      } catch (_) {
        err.response = { data: { message: text } };
      }
      throw err;
    }

    return { data: await resp.json() };
  },
  
  // Upload for registration (no auth required)
  uploadForRegistration: async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);

    // Use fetch for multipart upload so we don't inherit axios default JSON header
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const url = `${base}/uploads/register`;

    const resp = await fetch(url, {
      method: 'POST',
      body: fd,
    });

    if (!resp.ok) {
      const text = await resp.text();
      const err: any = new Error('Upload failed');
      try {
        err.response = { data: JSON.parse(text) };
      } catch (_) {
        err.response = { data: { message: text } };
      }
      throw err;
    }

    return { data: await resp.json() };
  },
};

export const commentsApi = {
  getByPostId: (postId: string) => api.get(`/posts/${postId}/comments`),
  create: (postId: string, content: string) =>
    api.post(`/posts/${postId}/comments`, { content }),
};

export const aiApi = {
  chat: (message: string) => api.post('/ai/chat', { message }),
};

export default api;


