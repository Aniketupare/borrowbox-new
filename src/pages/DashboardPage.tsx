import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { getBorrowRequests } from '../api/borrowRequests';
import { getBookings } from '../api/bookings';
import { getNotifications } from '../api/notifications';
import { getConversations } from '../api/messages';

export const DashboardPage = () => {
  const { user } = useAuth();
  
  const { data: requests } = useQuery({ queryKey: ['requests'], queryFn: getBorrowRequests, retry: false, placeholderData: [] });
  const { data: bookings } = useQuery({ queryKey: ['bookings'], queryFn: getBookings, retry: false, placeholderData: [] });
  const { data: notifications } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications, retry: false, placeholderData: [] });
  const { data: conversations } = useQuery({ queryKey: ['conversations'], queryFn: getConversations, retry: false, placeholderData: [] });

  if (!user) return <div className="p-8">Loading...</div>;

  const pendingRequests = Array.isArray(requests) ? requests.filter(r => r && r.status === 'PENDING') : [];
  const confirmedBookings = Array.isArray(bookings) ? bookings.filter(b => b && b.status === 'CONFIRMED') : [];
  const unreadNotifications = Array.isArray(notifications) ? notifications.filter(n => n && !n.isRead) : [];
  const safeConversations = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Welcome back, {user.name || 'User'}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card & Quick Actions */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <h2 className="font-semibold text-primary mb-2">Profile</h2>
            <p className="text-text">{user.name || 'User'}</p>
            <p className="text-text text-sm">{user.email || ''}</p>
            <Link to="/profile" className="text-accent text-sm mt-2 block hover:underline">Edit Profile</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={() => window.location.href='/listings/new'}>+ List New Item</Button>
            <Link to="/listings" className="text-primary hover:text-accent">Manage My Listings</Link>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-primary mb-4">Pending Requests</h2>
            {pendingRequests.length > 0 ? (
              pendingRequests.map(req => {
                if (!req) return null;
                const borrowerName = req.borrower?.name || 'A user';
                const itemTitle = req.item?.title || 'Item no longer available';
                return (
                  <div key={req._id || Math.random()} className="p-3 bg-background rounded border border-border mb-2">
                    {borrowerName} requested {itemTitle} 
                    <Link to="/requests" className="text-accent hover:underline ml-2">View</Link>
                  </div>
                );
              })
            ) : <p className="text-text">No pending requests.</p>}
          </section>

          <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-primary mb-4">Upcoming Bookings</h2>
            {confirmedBookings.length > 0 ? (
              confirmedBookings.map(book => {
                if (!book) return null;
                const itemTitle = book.item?.title || 'Item no longer available';
                const dateStr = book.startDate ? new Date(book.startDate).toLocaleDateString() : 'N/A';
                return (
                  <div key={book._id || Math.random()} className="p-3 bg-background rounded border border-border mb-2">
                    {itemTitle} on {dateStr}
                  </div>
                );
              })
            ) : <p className="text-text">No upcoming bookings.</p>}
            <Link to="/bookings" className="text-accent hover:underline text-sm">View All Bookings</Link>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-primary mb-3">Notifications</h2>
              {unreadNotifications.length > 0 ? (
                unreadNotifications.slice(0, 3).map(n => {
                  if (!n) return null;
                  return <p key={n._id || Math.random()} className="text-sm text-text mb-2">{n.content || 'Notification'}</p>;
                })
              ) : <p className="text-sm text-text">No new notifications.</p>}
              <Link to="/notifications" className="text-accent hover:underline text-sm">View All</Link>
            </section>
            <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-primary mb-3">Messages</h2>
              {safeConversations.length > 0 ? (
                safeConversations.slice(0, 3).map(c => {
                  if (!c) return null;
                  const otherParticipant = c.participants?.find(p => p && p._id !== user.id);
                  const otherName = otherParticipant?.name || 'User';
                  const lastMsg = c.lastMessage?.content || '';
                  return (
                    <p key={c._id || Math.random()} className="text-sm text-text mb-2">
                      {otherName}: {lastMsg}
                    </p>
                  );
                })
              ) : <p className="text-sm text-text">No messages.</p>}
              <Link to="/messages" className="text-accent hover:underline text-sm">View All</Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
