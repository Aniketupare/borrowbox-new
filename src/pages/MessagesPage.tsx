import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getConversations } from '../api/messages';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';

export const MessagesPage = () => {
  const { user } = useAuth();
  
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    retry: false,
    placeholderData: [],
  });

  if (isLoading) return <div className="max-w-4xl mx-auto p-8"><Skeleton className="h-64" /></div>;
  if (error) return <div className="max-w-4xl mx-auto p-8 text-center"><p className="text-red-500 mb-2">Unable to load messages. Please try again.</p><Link to="/dashboard" className="text-accent underline text-sm">Back to Dashboard</Link></div>;

  const safeConversations = Array.isArray(conversations) ? conversations : [];

  // Sort conversations by newest activity first
  const sortedConversations = [...safeConversations].sort((a, b) => {
    const timeA = new Date(b.lastMessage?.createdAt || (b as any).updatedAt || 0).getTime();
    const timeB = new Date(a.lastMessage?.createdAt || (a as any).updatedAt || 0).getTime();
    return timeA - timeB;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Messages</h1>

      {sortedConversations.length > 0 ? (
        <div className="bg-surface rounded-xl border border-border shadow-sm">
          {sortedConversations.map(c => {
            if (!c || !Array.isArray(c.participants)) return null;
            const otherParticipant = c.participants.find(p => p && p._id !== user?.id);
            const lastMsgContent = c.lastMessage?.content || 'No messages yet';
            const lastMsgTime = c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            return (
              <Link key={c._id || Math.random()} to={`/messages/${c._id}`} className="block p-4 border-b border-border hover:bg-background transition last:border-b-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center font-bold text-primary">
                      {(otherParticipant?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{otherParticipant?.name || 'Unknown User'}</h3>
                      <p className={`text-sm ${c.unreadCount > 0 ? 'text-primary font-medium' : 'text-text'}`}>{lastMsgContent}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text">{lastMsgTime}</p>
                    {c.unreadCount > 0 && <span className="inline-block bg-accent text-white text-xs px-2 py-0.5 rounded-full mt-1">{c.unreadCount}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-text">No conversations yet.</p>
        </div>
      )}
    </div>
  );
};
