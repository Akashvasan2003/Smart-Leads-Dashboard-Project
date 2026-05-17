import apiClient from './client';
import { ApiResponse, Lead, LeadFilters, CreateLeadInput, UpdateLeadInput } from '../types';

export const leadsApi = {
  getLeads: async (filters: LeadFilters = {}) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
    );
    const res = await apiClient.get<ApiResponse<Lead[]>>('/leads', { params });
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get<ApiResponse<{
      total: number;
      new: number;
      contacted: number;
      qualified: number;
      lost: number;
    }>>('/leads/stats');
    return res.data;
  },

  getLead: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: CreateLeadInput) => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: UpdateLeadInput) => {
    const res = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string) => {
    const res = await apiClient.delete<ApiResponse>(`/leads/${id}`);
    return res.data;
  },

  exportLeads: async (filters: Omit<LeadFilters, 'page' | 'limit'> = {}) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
    );
    const res = await apiClient.get('/leads/export', { params, responseType: 'blob' });
    return res.data as Blob;
  },
};
