import { Lead } from '../../types';
import { STATUS_COLORS, SOURCE_COLORS } from '../../constants';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadsTable = ({ leads, onEdit, onDelete }: LeadsTableProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Email</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Source</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Created</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-4 py-3">
                <button
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {lead.name}
                </button>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.email}</td>
              <td className="px-4 py-3">
                <Badge label={lead.status} colorClass={STATUS_COLORS[lead.status]} />
              </td>
              <td className="px-4 py-3">
                <Badge label={lead.source} colorClass={SOURCE_COLORS[lead.source]} />
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
                    Edit
                  </Button>
                  {user?.role === 'admin' && (
                    <Button variant="danger" size="sm" onClick={() => onDelete(lead)}>
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
