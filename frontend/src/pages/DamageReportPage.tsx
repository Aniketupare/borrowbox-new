import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createDamageReport } from '../api/reports';
import { getBookings } from '../api/bookings';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';

export const DamageReportPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ booking: '', type: '', description: '', estimatedCost: '' });
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const mutation = useMutation({
    mutationFn: createDamageReport,
    onSuccess: () => navigate('/dashboard'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      estimatedCost: Number(formData.estimatedCost),
    });
  };

  if (isLoading) return <div className="max-w-2xl mx-auto p-8"><Skeleton className="h-96" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to="/bookings" className="text-accent hover:underline mb-4 block">&larr; Back to Bookings</Link>
      <h1 className="text-3xl font-bold text-primary mb-6">Report Damage</h1>
      
      <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Select Booking</label>
          <select className="w-full p-3 border border-border rounded-lg bg-surface" value={formData.booking} onChange={(e) => setFormData({...formData, booking: e.target.value})} required>
            <option value="">Select a booking</option>
            {bookings?.map(b => <option key={b._id} value={b._id}>{b.item.title} ({new Date(b.startDate).toLocaleDateString()})</option>)}
          </select>
        </div>

        <Input label="Damage Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-primary">Description</label>
          <textarea className="w-full p-3 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent" rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        </div>

        <Input label="Estimated Cost (₹)" type="number" value={formData.estimatedCost} onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})} required />

        <p className="text-sm text-text italic">Note: Image evidence upload is not currently supported.</p>
        
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Submitting...' : 'Submit Report'}</Button>
      </form>
    </div>
  );
};
