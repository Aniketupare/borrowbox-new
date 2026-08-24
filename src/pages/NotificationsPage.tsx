import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead, type INotification } from '../api/notifications';
import { Button } from '../components/ui/Button';
import { useSocket } from '../context/SocketContext';
import { useEffect } from 'react';
import { Skeleton } from '../components/ui/Skeleton';

export const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const navigate = useNavigate();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    retry: false,
    placeholderData: [],
  });

  useEffect(() => {
    if (socket) {
      socket.on('notification', () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      });
      return () => {
        socket.off('notification');
      };
    }
  }, [socket, queryClient]);

  const readMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (isLoading) return <div className="max-w-4xl mx-auto p-8"><Skeleton className="h-64" /></div>;
  if (error) return <div className="max-w-4xl mx-auto p-8 text-center"><p className="text-red-500 mb-2">Unable to load notifications.</p></div>;

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => n && !n.isRead).length;

  const handleNotificationClick = (n: INotification) => {
    if (!n.isRead) {
      readMutation.mutate(n._id);
    }
    if (n.type === 'BORROW_REQUEST' || n.type === 'BOOKING_UPDATE') {
      navigate('/requests');
    } else if (n.type === 'MESSAGE') {
      navigate(n.referenceId ? `/messages/${n.referenceId}` : '/messages');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Notifications {unreadCount > 0 ? `(${unreadCount} unread)` : ''}</h1>
      </div>

      {safeNotifications.length > 0 ? (
        <div className="space-y-4">
          {safeNotifications.map(n => {
            if (!n) return null;
            const timeStr = n.createdAt ? new Date(n.createdAt).toLocaleString() : '';
            return (
              <div 
                key={n._id || Math.random()} 
                onClick={() => handleNotificationClick(n)}
                className={`p-5 rounded-xl border border-border shadow-sm flex justify-between items-start cursor-pointer hover:border-accent transition-all ${n.isRead ? 'bg-surface' : 'bg-background border-l-4 border-l-accent'}`}
              >
                <div className="flex-grow pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-primary">{n.type?.replace('_', ' ') || 'Notification'}</h3>
                    {!n.isRead && <span className="inline-block w-2 h-2 rounded-full bg-accent" />}
                  </div>
                  <p className="text-sm text-text mb-2">{n.content || 'You have a new update.'}</p>
                  <p className="text-xs text-text opacity-70">{timeStr}</p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {!n.isRead && (
                    <Button variant="outline" className="text-xs py-1 px-3" onClick={() => readMutation.mutate(n._id)} disabled={readMutation.isPending}>
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-text">No notifications.</p>
        </div>
      )}
    </div>
  );
};
