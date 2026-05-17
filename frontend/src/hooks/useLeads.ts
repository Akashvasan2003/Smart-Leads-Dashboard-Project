import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/leads';
import { LeadFilters, CreateLeadInput, UpdateLeadInput } from '../types';
import toast from 'react-hot-toast';

export const LEADS_KEY = 'leads';

export const useLeadStats = () =>
  useQuery({
    queryKey: [LEADS_KEY, 'stats'],
    queryFn: () => leadsApi.getStats(),
  });

export const useLeads = (filters: LeadFilters) =>
  useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
  });

export const useLead = (id: string) =>
  useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: () => leadsApi.getLead(id),
    enabled: !!id,
  });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadInput) => leadsApi.createLead(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [LEADS_KEY, 'stats'] });
      toast.success('Lead created successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadInput }) =>
      leadsApi.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [LEADS_KEY, 'stats'] });
      toast.success('Lead updated successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [LEADS_KEY, 'stats'] });
      toast.success('Lead deleted successfully');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to delete lead');
    },
  });
};
