import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, deleteItem } from '../api/items';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';

export const MyListingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setDeleteId(null);
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to delete listing.');
      setDeleteId(null);
    }
  });

  if (isLoading) return <div className="max-w-7xl mx-auto p-8"><Skeleton className="h-64" /></div>;
  if (error) return <p className="text-center text-red-500">Error loading listings.</p>;

  const myListings = (listings || []).filter(l => {
    if (!user || !l.owner) return false;
    const ownerId = typeof l.owner === 'object' && l.owner !== null ? (l.owner as any)._id || (l.owner as any).id : l.owner;
    return String(ownerId) === String(user.id);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">My Listings</h1>
        <Button onClick={() => navigate('/listings/new')}>+ Create Listing</Button>
      </div>

      {errorMsg && <p className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200">{errorMsg}</p>}

      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map(l => {
            const isBorrowed = l.status === 'Borrowed';
            return (
              <div key={l._id} className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <img src={l.images[0] || 'https://via.placeholder.com/400'} alt={l.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <h3 className="font-semibold text-primary mb-1">{l.title}</h3>
                  <p className="text-sm text-text mb-2">{l.condition} • <span className={`font-medium ${isBorrowed ? 'text-amber-600' : 'text-green-600'}`}>{l.status || 'Available'}</span></p>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                  <Link to={`/items/${l._id}`} className="bg-surface border border-border text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-border/60 shadow-sm">View</Link>
                  {!isBorrowed && (
                    <Link to={`/listings/edit/${l._id}`} className="bg-surface border border-border text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-border/60 shadow-sm">Edit</Link>
                  )}
                  {!isBorrowed && (
                    <button className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm ml-auto" onClick={() => setDeleteId(l._id)}>Delete</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-text mb-4">You have no listings yet.</p>
          <Button onClick={() => navigate('/listings/new')}>Create your first listing</Button>
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!deleteId} 
        title="Are you sure you want to delete this listing?" 
        onConfirm={() => deleteMutation.mutate(deleteId!)} 
        onCancel={() => setDeleteId(null)} 
      />
    </div>
  );
};
