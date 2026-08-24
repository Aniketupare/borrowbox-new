import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAdminUsers } from '../api/admin';
import { Skeleton } from '../components/ui/Skeleton';

export const AdminUsersPage = () => {
  const { data: users, isLoading, isError } = useQuery({ queryKey: ['adminUsers'], queryFn: getAdminUsers });

  if (isLoading) return <div className="max-w-7xl mx-auto p-8"><Skeleton className="h-96" /></div>;
  if (isError) return <div className="max-w-7xl mx-auto p-8 text-red-500">Failed to load users.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/admin" className="text-accent hover:underline">&larr; Back to Admin Dashboard</Link>
        <h1 className="text-3xl font-bold text-primary">User Management</h1>
      </div>
      
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-text">Name</th>
                <th className="p-3 text-text">Email</th>
                <th className="p-3 text-text">Role</th>
                <th className="p-3 text-text">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map(u => (
                  <tr key={u._id} className="border-b border-border hover:bg-background/50">
                    <td className="p-3 text-primary font-medium">{u.name}</td>
                    <td className="p-3 text-text">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-text text-sm">
                      {(u as any).createdAt ? new Date((u as any).createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-text">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
