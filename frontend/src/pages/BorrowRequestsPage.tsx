import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getBorrowRequests, approveRequest, rejectRequest, cancelRequest } from '../api/borrowRequests';
import { startConversation } from '../api/messages';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/ui/Skeleton';

export const BorrowRequestsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['requests'],
    queryFn: getBorrowRequests,
    retry: false,
    placeholderData: [],
  });

  const approveMutation = useMutation({ mutationFn: approveRequest, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests'] }) });
  const rejectMutation = useMutation({ mutationFn: rejectRequest, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests'] }) });
  const cancelMutation = useMutation({ mutationFn: cancelRequest, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests'] }) });

  const messageMutation = useMutation({
    mutationFn: (recipientId: string) => startConversation(recipientId),
    onSuccess: (conversation) => {
      navigate(`/messages/${conversation._id}`);
    }
  });

  if (isLoading) return <div className="max-w-7xl mx-auto p-8"><Skeleton className="h-64" /></div>;
  if (error) return <p className="text-center text-red-500">Error loading requests.</p>;

  const safeRequests = Array.isArray(requests) ? requests : [];
  const currentUserId = user?.id;

  // Sort requests newest first (using createdAt or _id timestamp)
  const sortedRequests = [...safeRequests].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const incoming = sortedRequests.filter(r => {
    if (!r || !r.owner) return false;
    const ownerId = typeof r.owner === 'object' ? (r.owner as any)._id || (r.owner as any).id : r.owner;
    return String(ownerId) === String(currentUserId);
  });

  const sent = sortedRequests.filter(r => {
    if (!r || !r.borrower) return false;
    const borrowerId = typeof r.borrower === 'object' ? (r.borrower as any)._id || (r.borrower as any).id : r.borrower;
    return String(borrowerId) === String(currentUserId);
  });

  const handleMessageOwner = (ownerRef: any) => {
    if (!ownerRef) return;
    const ownerId = typeof ownerRef === 'object' ? ownerRef._id || ownerRef.id : ownerRef;
    if (ownerId) {
      messageMutation.mutate(ownerId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Borrow Requests</h1>

      {/* Incoming */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-primary mb-4">Incoming Requests</h2>
        {incoming.length > 0 ? (
          <div className="space-y-4">
            {incoming.map(req => {
              if (!req) return null;
              const itemTitle = req.item?.title || 'Item no longer available';
              const borrowerName = req.borrower?.name || 'User unavailable';
              const startDateStr = req.startDate ? new Date(req.startDate).toLocaleDateString() : 'N/A';
              const endDateStr = req.endDate ? new Date(req.endDate).toLocaleDateString() : 'N/A';

              return (
                <div key={req._id || Math.random()} className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-primary">{itemTitle}</h3>
                    <p className="text-sm text-text">Requested by {borrowerName} for {startDateStr} - {endDateStr}</p>
                    <p className="text-sm font-medium text-accent">Status: {req.status || 'PENDING'}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {req.status === 'PENDING' && (
                      <>
                        <Button variant="secondary" onClick={() => approveMutation.mutate(req._id)} disabled={approveMutation.isPending}>Approve</Button>
                        <Button variant="outline" className="text-red-600 border-red-600" onClick={() => rejectMutation.mutate(req._id)} disabled={rejectMutation.isPending}>Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="text-text">No incoming requests.</p>}
      </section>

      {/* Sent */}
      <section>
        <h2 className="text-xl font-semibold text-primary mb-4">My Sent Requests</h2>
        {sent.length > 0 ? (
          <div className="space-y-4">
            {sent.map(req => {
              if (!req) return null;
              const itemTitle = req.item?.title || 'Item no longer available';
              const ownerObj = req.owner;
              const ownerName = ownerObj?.name || 'Owner unavailable';

              const startDateStr = req.startDate ? new Date(req.startDate).toLocaleDateString() : 'N/A';
              const endDateStr = req.endDate ? new Date(req.endDate).toLocaleDateString() : 'N/A';

              return (
                <div key={req._id || Math.random()} className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-primary">{itemTitle}</h3>
                    <p className="text-sm text-text">Requested to {ownerName} for {startDateStr} - {endDateStr}</p>
                    <p className="text-sm font-medium text-accent">Status: {req.status || 'PENDING'}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    {ownerObj ? (
                      <Button variant="secondary" onClick={() => handleMessageOwner(ownerObj)} disabled={messageMutation.isPending}>
                        💬 Message Owner
                      </Button>
                    ) : (
                      <span className="text-xs text-text italic">Owner unavailable</span>
                    )}
                    {req.status === 'PENDING' && (
                      <Button variant="outline" className="text-red-600 border-red-600" onClick={() => cancelMutation.mutate(req._id)} disabled={cancelMutation.isPending}>Cancel</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="text-text">No sent requests.</p>}
      </section>
    </div>
  );
};
