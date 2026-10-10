import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import api from '../services/api';

const leaveSchema = z.object({
  leaveType: z.string().min(1, 'Please select a leave type'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Please provide a reason (min 5 chars)')
});

export default function LeaveRequestForm({ onSuccess, onCancel, currentUserId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(leaveSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await api.post('/leaves', data);
      onSuccess();
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {submitError && (
        <div className="p-3 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-xl text-sm font-medium">
          {submitError}
        </div>
      )}

      <Select 
        label="Leave Type"
        options={[
          { label: 'Select type...', value: '' },
          { label: 'Casual Leave (CL)', value: 'Casual Leave (CL)' },
          { label: 'Sick Leave (SL)', value: 'Sick Leave (SL)' },
          { label: 'Earned Leave (EL)', value: 'Earned Leave (EL)' },
          { label: 'Unpaid Leave', value: 'Unpaid Leave' }
        ]}
        {...register('leaveType')}
        error={errors.leaveType?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Start Date" 
          type="date"
          {...register('startDate')}
          error={errors.startDate?.message}
        />
        <Input 
          label="End Date" 
          type="date"
          {...register('endDate')}
          error={errors.endDate?.message}
        />
      </div>

      <div className="space-y-1.5 w-full">
        <label className="text-sm font-semibold text-[var(--color-text-primary)] block">Reason</label>
        <textarea 
          className={`w-full bg-[var(--color-background)] border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 resize-none h-24
            ${errors.reason ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger-border)]' : 'border-[var(--color-border)] focus:border-[var(--color-brand-blue)] focus:ring-[var(--color-brand-light)]'}
          `}
          placeholder="I will be taking leave for..."
          {...register('reason')}
        ></textarea>
        {errors.reason && <p className="text-xs text-[var(--color-danger)] font-medium mt-1">{errors.reason.message}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
