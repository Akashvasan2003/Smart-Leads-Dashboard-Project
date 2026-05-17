import apiClient from './client';
import { ApiResponse, User } from '../types';

interface AuthData {
  user: User;
  token: string;
}

export const authApi = {
  register: async (data: { name: string; email: string; password: string; role?: string }) => {
    const res = await apiClient.post<ApiResponse<AuthData>>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<AuthData>>('/auth/login', data);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data;
  },
};
