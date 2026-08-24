import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, uploadImage } from '../api/items';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPicker } from '../components/location/MapPicker';

export const CreateListingPage = () => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    condition: 'Good', 
    borrowingFee: '', 
    securityDeposit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    longitude: 77.5946,
    latitude: 12.9716
  });
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      let imageUrl = '';
      if (file) {
        const res = await uploadImage(file);
        imageUrl = res.url;
      }
      return createItem({ 
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
        borrowingFee: Number(data.borrowingFee),
        securityDeposit: Number(data.securityDeposit),
        images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'],
        location: {
          coordinates: [Number(data.longitude), Number(data.latitude)]
        },
        availability: {
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString()
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigate('/listings');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Link to="/listings" className="text-accent hover:underline mb-4 block">&larr; Back to My Listings</Link>
      <h1 className="text-3xl font-bold text-primary mb-8">Create New Listing</h1>
      
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-6">
        <Input label="Item Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-primary">Description</label>
          <textarea className="w-full p-3 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent" rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-primary">Condition</label>
            <select 
              className="w-full p-3 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.condition} 
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <Input label="Daily Fee (₹)" type="number" step="0.01" value={formData.borrowingFee} onChange={(e) => setFormData({...formData, borrowingFee: e.target.value})} required />
          <Input label="Security Deposit (₹)" type="number" step="0.01" value={formData.securityDeposit} onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})} required />
          <Input label="Available From" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
          <Input label="Available Until" type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary">Item Location (Click map or use current location)</label>
          <MapPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
          />
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-text">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <p className="text-xs text-text mt-2">Optional image upload (max 5MB)</p>
        </div>

        {mutation.isError && <p className="text-red-500">Error creating listing. Please check all fields.</p>}

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Creating...' : 'Create Listing'}</Button>
          <Button variant="outline" type="button" onClick={() => navigate('/listings')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};
