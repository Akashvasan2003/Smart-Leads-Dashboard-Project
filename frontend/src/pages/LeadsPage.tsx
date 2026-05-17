import { useState } from 'react';
import { Lead, LeadFilters } from '../types';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { useExportLeads } from '../hooks/useExportLeads';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadFiltersPanel } from '../components/leads/LeadFilters';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export const LeadsPage = () => {
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  const activeFilters = { ...filters, search: debouncedSearch || undefined };
  const { data, isLoading, isError } = useLeads(activeFilters);

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const { exportToCSV } = useExportLeads();

  const [showCreate, setShowCreate] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const leads = data?.data || [];
  const meta = data?.meta;

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const handleReset = () => {
    setFilters({ sort: 'latest', page: 1 });
    setSearchInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {meta ? `${meta.totalRecords} total leads` : 'Manage your leads'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => exportToCSV({ status: filters.status, source: filters.source, search: debouncedSearch || undefined, sort: filters.sort })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </Button>
        </div>
      </div>

      <LeadFiltersPanel
        filters={filters}
        searchValue={searchInput}
        onSearchChange={(v) => { setSearchInput(v); setFilters((p) => ({ ...p, page: 1 })); }}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className="card">
        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Failed to load leads. Please try again.</div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters or create a new lead."
            action={<Button onClick={() => setShowCreate(true)}>Add Lead</Button>}
          />
        ) : (
          <>
            <LeadsTable leads={leads} onEdit={setEditLead} onDelete={setDeletingLead} />
            {meta && (
              <Pagination
                meta={meta}
                onPageChange={(page) => setFilters((p) => ({ ...p, page }))}
              />
            )}
          </>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Lead">
        <LeadForm
          onCancel={() => setShowCreate(false)}
          isLoading={createLead.isPending}
          onSubmit={(data) => createLead.mutate(data, { onSuccess: () => setShowCreate(false) })}
        />
      </Modal>

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
