import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, returnBooking, cancelBooking } from '../api/bookings';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';

export const BookingsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [action, setAction] = useState<{ id: string, type: 'cancel' | 'return' } | null>(null);

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const cancelMutation = useMutation({ mutationFn: cancelBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }) });
  const returnMutation = useMutation({ mutationFn: returnBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }) });

  const handleAction = () => {
    if (action) {
      if (action.type === 'cancel') cancelMutation.mutate(action.id);
      if (action.type === 'return') returnMutation.mutate(action.id);
      setAction(null);
    }
  };

  if (isLoading) return <div className="max-w-7xl mx-auto p-8"><Skeleton className="h-64" /></div>;
  if (error) return <p className="text-center text-red-500">Error loading bookings.</p>;

  const renderSection = (title: string, status: string[]) => {
    const filtered = bookings?.filter(b => status.includes(b.status)) || [];
    return (
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-primary mb-4">{title}</h2>
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(b => (
              <div key={b._id} className="bg-surface p-4 rounded-xl border border-border shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-primary"><Link to={`/items/${b.item._id}`} className="hover:underline">{b.item.title}</Link></h3>
                  <p className="text-sm text-text">Partner: {user?.id === b.borrower._id ? b.owner.name : b.borrower.name} • {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                  <p className="text-sm font-medium text-accent">Status: {b.status}</p>
                </div>
                <div className="flex gap-2">
                  {b.status === 'CONFIRMED' && <Button variant="outline" className="text-red-600 border-red-600" onClick={() => setAction({ id: b._id, type: 'cancel' })}>Cancel</Button>}
                  {b.status === 'ACTIVE' && user?.id === b.borrower._id && <Button variant="secondary" onClick={() => setAction({ id: b._id, type: 'return' })}>Return</Button>}
                  {b.status === 'RETURNED' && (
                    <>
                      <Link to="/reviews/new" state={{ bookingId: b._id, itemId: b.item._id }} className="bg-accent text-white px-4 py-2 rounded-lg text-sm">Review</Link>
                      <Link to="/reports/new" className="bg-border text-primary px-4 py-2 rounded-lg text-sm">Report</Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-text">No bookings found.</p>}
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">My Bookings</h1>
      {renderSection('Upcoming', ['CONFIRMED'])}
      {renderSection('Active', ['ACTIVE'])}
      {renderSection('Completed', ['RETURNED', 'CANCELLED'])}

      <ConfirmDialog 
        isOpen={!!action} 
        title={`Are you sure you want to ${action?.type} this booking?`} 
        onConfirm={handleAction} 
        onCancel={() => setAction(null)} 
      />
    </div>
  );
};
