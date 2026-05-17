import { useParams, useNavigate } from 'react-router-dom';
import { useLead } from '../hooks/useLeads';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { STATUS_COLORS, SOURCE_COLORS } from '../constants';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLead(id!);

  const lead = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <div className="card p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6" />)}
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">Lead not found</p>
        <Button onClick={() => navigate('/leads')}>Back to Leads</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white mt-1">{lead.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <div className="mt-1">
              <Badge label={lead.status} colorClass={STATUS_COLORS[lead.status]} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
            <div className="mt-1">
              <Badge label={lead.source} colorClass={SOURCE_COLORS[lead.source]} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
            <p className="font-medium text-gray-900 dark:text-white mt-1">
              {new Date(lead.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
