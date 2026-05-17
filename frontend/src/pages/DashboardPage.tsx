import { useState } from 'react';
import { Lead } from '../types';
import { useLeads, useLeadStats, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { StatCard } from '../components/ui/StatCard';
import { TableSkeleton } from '../components/ui/Skeleton';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const DashboardPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLeads({ limit: 5, sort: 'latest', page });
  const { data: statsData } = useLeadStats();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const leads = data?.data || [];
  const meta = data?.meta;
  const stats = statsData?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your leads pipeline</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats?.total ?? 0}
          colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          title="New Leads"
          value={stats?.new ?? 0}
          colorClass="bg-green-100 dark:bg-green-900/30 text-green-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
        />
        <StatCard
          title="Qualified"
          value={stats?.qualified ?? 0}
          colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Lost"
          value={stats?.lost ?? 0}
          colorClass="bg-red-100 dark:bg-red-900/30 text-red-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="card">
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Leads</h2>
        </div>
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <>
            <LeadsTable leads={leads} onEdit={setEditLead} onDelete={setDeletingLead} />
            {meta && meta.totalPages > 1 && (
              <Pagination meta={meta} onPageChange={setPage} />
            )}
          </>
        )}
      </div>

      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            lead={editLead}
            onCancel={() => setEditLead(null)}
            isLoading={updateLead.isPending}
            onSubmit={(data) =>
              updateLead.mutate({ id: editLead._id, data }, { onSuccess: () => setEditLead(null) })
            }
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={() =>
          deleteLead.mutate(deletingLead!._id, { onSuccess: () => setDeletingLead(null) })
        }
        title="Delete Lead"
        message={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
        isLoading={deleteLead.isPending}
      />
    </div>
  );
};
