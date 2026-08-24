import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItemById, updateItem, deleteItem, uploadImage } from '../api/items';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { MapPicker } from '../components/location/MapPicker';

export const EditListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
  const [showDelete, setShowDelete] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition || 'Good',
        borrowingFee: item.borrowingFee.toString(),
        securityDeposit: (item.securityDeposit ?? 0).toString(),
        startDate: item.availability?.startDate ? new Date(item.availability.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: item.availability?.endDate ? new Date(item.availability.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        longitude: item.location?.coordinates?.[0] ?? 77.5946,
        latitude: item.location?.coordinates?.[1] ?? 12.9716,
      });
    }
  }, [item]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      let imagesArray = item?.images || [];
      if (file) {
        const res = await uploadImage(file);
        if (res && res.url) {
          imagesArray = [res.url];
        }
      }

      if (!imagesArray || imagesArray.length === 0) {
        throw new Error('At least one image is required. Please upload a photo.');
      }

      return updateItem(id!, {
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
        borrowingFee: Number(data.borrowingFee),
        securityDeposit: Number(data.securityDeposit),
        images: imagesArray,
        location: {
          type: 'Point',
          coordinates: [Number(data.longitude), Number(data.latitude)]
        },
        availability: {
          startDate: new Date(data.startDate + 'T00:00:00.000Z').toISOString(),
          endDate: new Date(data.endDate + 'T23:59:59.999Z').toISOString()
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigate('/listings');
    },
    onError: () => {
      // error handled via updateMutation.isError
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigate('/listings');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="max-w-3xl mx-auto p-8"><Skeleton className="h-96" /></div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Link to="/listings" className="text-accent hover:underline mb-4 block">&larr; Back to My Listings</Link>
      <h1 className="text-3xl font-bold text-primary mb-8">Edit Listing</h1>
      
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
            latitude={Number(formData.latitude)}
            longitude={Number(formData.longitude)}
            onChange={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
          />
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-text">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <p className="text-xs text-text mt-2">Optional image upload (max 5MB)</p>
        </div>

        {updateMutation.isError && <p className="text-red-500">Error updating listing. Please check all fields.</p>}

        <div className="flex gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</Button>
          <Button variant="outline" type="button" onClick={() => navigate('/listings')}>Cancel</Button>
          <Button variant="outline" type="button" className="text-red-600 border-red-600" onClick={() => setShowDelete(true)}>Delete Listing</Button>
        </div>
      </form>

      <ConfirmDialog 
        isOpen={showDelete}
        title="Are you sure you want to delete this listing?"
        onConfirm={() => deleteMutation.mutate(id!)}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
};
