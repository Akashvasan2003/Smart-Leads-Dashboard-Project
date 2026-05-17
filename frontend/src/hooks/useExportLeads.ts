import { leadsApi } from '../api/leads';
import { LeadFilters } from '../types';
import toast from 'react-hot-toast';

export const useExportLeads = () => {
  const exportToCSV = async (filters: Omit<LeadFilters, 'page' | 'limit'>) => {
    try {
      const blob = await leadsApi.exportLeads(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Leads exported successfully');
    } catch {
      toast.error('Failed to export leads');
    }
  };

  return { exportToCSV };
};
