import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LeadForm = ({ lead, onSubmit, onCancel, isLoading }: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: lead
      ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source }
      : { status: 'New' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} />
      <Select
        label="Status"
        error={errors.status?.message}
        options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
        {...register('status')}
      />
      <Select
        label="Source"
        placeholder="Select source"
        error={errors.source?.message}
        options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
        {...register('source')}
      />
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
