import { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItemById } from '../api/items';
import { createBorrowRequest } from '../api/borrowRequests';
import { startConversation } from '../api/messages';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ReviewSection } from '../components/ui/ReviewSection';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { ItemLocationMap } from '../components/location/ItemLocationMap';

export const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: createBorrowRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate('/requests');
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to create borrow request.');
    }
  });

  const messageMutation = useMutation({
    mutationFn: (recipientId: string) => startConversation(recipientId),
    onSuccess: (conversation) => {
      navigate(`/messages/${conversation._id}`);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to start conversation.');
    }
  });

  const handleRequest = () => {
    setErrorMsg('');
    if (!isAuthenticated) return navigate('/login', { state: { from: location } });
    if (!id || !startDate || !endDate) {
      setErrorMsg('Please select both start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg('End date must be after or equal to start date.');
      return;
    }

    const startIso = new Date(startDate + 'T00:00:00.000Z').toISOString();
    const endIso = new Date(endDate + 'T23:59:59.999Z').toISOString();

    mutation.mutate({
      item: id,
      startDate: startIso,
      endDate: endIso,
      message,
    });
  };

  const handleMessageOwner = () => {
    if (!isAuthenticated) return navigate('/login', { state: { from: location } });
    const ownerObj = typeof item?.owner === 'object' && item.owner !== null ? item.owner : null;
    const ownerId = ownerObj?._id || (typeof item?.owner === 'string' ? item.owner : null);
    if (!ownerId) return;
    messageMutation.mutate(ownerId);
  };

  if (isLoading) return <div className="max-w-7xl mx-auto p-8"><Skeleton className="h-96" /></div>;
  if (error || !item) return <p className="text-center text-red-500">Error loading item.</p>;

  const ownerObj = typeof item.owner === 'object' && item.owner !== null ? item.owner : null;
  const ownerId = ownerObj?._id || (typeof item.owner === 'string' ? item.owner : null);
  const ownerName = ownerObj?.name || 'Owner';
  const isOwner = user && ownerId && String(user.id) === String(ownerId);
  const isBorrowed = item.status === 'Borrowed';

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Link to="/browse" className="text-accent hover:underline mb-4 block">&larr; Back to Browse</Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <img src={item.images[0] || 'https://via.placeholder.com/800'} alt={item.title} className="w-full h-96 object-cover rounded-2xl" />
          <div className="flex gap-4">
            {item.images.slice(1).map((img, i) => <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg" alt="" />)}
          </div>
        </div>

        {/* Info & Request */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">{item.title}</h1>
            <p className="text-text mb-4">{item.category} • {item.condition} • <span className={`font-semibold ${isBorrowed ? 'text-amber-600' : 'text-green-600'}`}>{item.status || 'Available'}</span></p>
            <p className="text-text">{item.description}</p>
          </div>

          {/* Location Map */}
          {item.location && item.location.coordinates && (
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-bold text-primary mb-4">Location</h3>
              <ItemLocationMap 
                latitude={item.location.coordinates[1]} 
                longitude={item.location.coordinates[0]} 
              />
            </div>
          )}

          {!isOwner && (
            <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-sm">
              <span className="text-text">Owner: <strong className="text-primary">{ownerName}</strong></span>
              <Button variant="secondary" onClick={handleMessageOwner} disabled={messageMutation.isPending}>
                {messageMutation.isPending ? 'Opening...' : `💬 Message ${ownerName}`}
              </Button>
            </div>
          )}

          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <p className="font-bold text-primary text-2xl mb-4">₹{item.borrowingFee} <span className="text-base font-normal text-text">/ day</span></p>
            
            {isOwner ? (
              <div className="p-4 bg-background border border-border rounded-lg text-text font-medium text-center">
                You cannot request your own listing.
              </div>
            ) : isBorrowed ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-amber-700 dark:text-amber-300 font-medium text-center">
                Currently borrowed / unavailable
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input 
                    label="Start Date" 
                    type="date" 
                    min={todayStr} 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    required 
                  />
                  <Input 
                    label="End Date" 
                    type="date" 
                    min={startDate || todayStr} 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    required 
                  />
                </div>
                <textarea 
                  className="w-full p-3 border border-border rounded-lg bg-surface mb-4 text-primary focus:outline-none focus:ring-2 focus:ring-accent" 
                  placeholder="Message to owner..." 
                  rows={3}
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                />
                {errorMsg && <p className="text-sm text-red-500 mb-4">{errorMsg}</p>}
                <Button className="w-full" onClick={handleRequest} disabled={mutation.isPending}>
                  {mutation.isPending ? 'Sending...' : 'Request Item'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <ReviewSection itemId={item._id} />
    </div>
  );
};
