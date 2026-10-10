import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MdPerson, MdMail, MdPhone, MdWork } from 'react-icons/md';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import api from '../services/api';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  departmentId: z.string().min(1, 'Please select a department'),
  designation: z.string().min(2, 'Designation is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.string()
});

export default function AddEmployeeForm({ onSuccess, onCancel }) {
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'Active'
    }
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data.data.map(d => ({ label: d.name, value: d._id })));
      } catch (err) {
        console.error('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      // Auto-generate employee ID for MVP
      data.employeeIdString = `EMP-${Math.floor(Math.random() * 9000) + 1000}`;
      await api.post('/employees', data);
      onSuccess();
    } catch (err) {
      setSubmitError(err.response?.data?.error?.message || 'Failed to create employee');
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

      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="First Name" 
          icon={MdPerson}
          placeholder="Rahul"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input 
          label="Last Name" 
          placeholder="Sharma"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <Input 
        label="Email Address" 
        type="email"
        icon={MdMail}
        placeholder="rahul.s@aayup.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input 
        label="Phone Number" 
        icon={MdPhone}
        placeholder="+91 98765 43210"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <div className="border-t border-[var(--color-border)] my-6 pt-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider">Employment Details</h3>
        
        <div className="space-y-4">
          <Select 
            label="Department"
            options={[{ label: 'Select Department', value: '' }, ...departments]}
            {...register('departmentId')}
            error={errors.departmentId?.message}
          />
          
          <Input 
            label="Designation" 
            icon={MdWork}
            placeholder="React Developer"
            {...register('designation')}
            error={errors.designation?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Joining Date" 
              type="date"
              {...register('joiningDate')}
              error={errors.joiningDate?.message}
            />
            
            <Select 
              label="Status"
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Offer Sent', value: 'Offer Sent' },
                { label: 'Candidate', value: 'Candidate' }
              ]}
              {...register('status')}
              error={errors.status?.message}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Employee'}
        </Button>
      </div>
    </form>
  );
}
