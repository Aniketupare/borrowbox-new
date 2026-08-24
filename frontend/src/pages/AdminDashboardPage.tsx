import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAdminUsers } from '../api/admin';
import { Skeleton } from '../components/ui/Skeleton';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['adminStats'], queryFn: getAdminStats });
  const { data: users, isLoading: usersLoading } = useQuery({ queryKey: ['adminUsers'], queryFn: getAdminUsers });

  if (statsLoading || usersLoading) return <div className="max-w-7xl mx-auto p-8"><Skeleton className="h-64" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={() => navigate('/admin/users')}
          className="bg-surface p-6 rounded-xl border border-border shadow-sm cursor-pointer hover:border-accent hover:shadow-md transition-all group"
        >
          <h3 className="text-sm font-medium text-text uppercase group-hover:text-accent transition-colors">Total Users &rarr;</h3>
          <p className="text-3xl font-bold text-primary mt-1">{stats?.userCount}</p>
        </div>
        <div 
          onClick={() => navigate('/admin/items')}
          className="bg-surface p-6 rounded-xl border border-border shadow-sm cursor-pointer hover:border-accent hover:shadow-md transition-all group"
        >
          <h3 className="text-sm font-medium text-text uppercase group-hover:text-accent transition-colors">Total Items &rarr;</h3>
          <p className="text-3xl font-bold text-primary mt-1">{stats?.itemCount}</p>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-sm font-medium text-text uppercase">Total Bookings</h3>
          <p className="text-3xl font-bold text-primary mt-1">{stats?.bookingCount}</p>
        </div>
      </div>

      {/* Users preview */}
      <section className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">User Management</h2>
          <button onClick={() => navigate('/admin/users')} className="text-accent text-sm hover:underline">View All Users &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-text">Name</th>
                <th className="p-2 text-text">Email</th>
                <th className="p-2 text-text">Role</th>
              </tr>
            </thead>
            <tbody>
              {users?.slice(0, 5).map(u => (
                <tr key={u._id} className="border-b border-border">
                  <td className="p-2 text-primary">{u.name}</td>
                  <td className="p-2 text-text">{u.email}</td>
                  <td className="p-2 text-text">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="mt-8 bg-surface p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-xl font-semibold text-primary mb-4">Moderation</h2>
        <p className="text-text italic">Booking management and dispute management endpoints are not exposed in the backend.</p>
      </section>
    </div>
  );
};
