import { LeadFilters } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface LeadFiltersProps {
  filters: LeadFilters;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof LeadFilters, value: string) => void;
  onReset: () => void;
}

export const LeadFiltersPanel = ({
  filters,
  searchValue,
  onSearchChange,
  onFilterChange,
  onReset,
}: LeadFiltersProps) => (
  <div className="card p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Input
        placeholder="Search by name or email..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        value={filters.status || ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        placeholder="All Statuses"
        options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
      />
      <Select
        value={filters.source || ''}
        onChange={(e) => onFilterChange('source', e.target.value)}
        placeholder="All Sources"
        options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
      />
      <Select
        value={filters.sort || 'latest'}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        options={[
          { value: 'latest', label: 'Latest First' },
          { value: 'oldest', label: 'Oldest First' },
        ]}
      />
    </div>
    {(filters.status || filters.source || filters.search) && (
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
        {filters.status && (
          <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {filters.status}
          </span>
        )}
        {filters.source && (
          <span className="badge bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {filters.source}
          </span>
        )}
        {filters.search && (
          <span className="badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            "{filters.search}"
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear all
        </Button>
      </div>
    )}
  </div>
);

