import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDispute } from '../api/reports';
import { Button } from '../components/ui/Button';

export const DisputesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { damageReportId } = location.state || {};

  const [formData, setFormData] = useState({ reason: '', description: '' });

  const mutation = useMutation({
    mutationFn: createDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!damageReportId) return;
    mutation.mutate({
      ...formData,
      damageReport: damageReportId,
    });
  };

  if (!damageReportId) return <p className="text-center p-8 text-red-500">Invalid dispute request.</p>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Initiate Dispute</h1>

      <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Reason</label>
          <select className="w-full p-3 border border-border rounded-lg bg-surface" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required>
            <option value="">Select reason</option>
            <option value="Damage liability disagreement">Damage liability disagreement</option>
            <option value="Incorrect damage assessment">Incorrect damage assessment</option>
            <option value="Item not returned">Item not returned</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-primary">Description</label>
          <textarea className="w-full p-3 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent" rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        </div>

        <p className="text-sm text-text italic">Note: Evidence upload is not currently supported.</p>

        <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Submitting...' : 'Submit Dispute'}</Button>
            <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

