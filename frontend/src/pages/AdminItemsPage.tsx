import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getItems } from '../api/items';
import { Skeleton } from '../components/ui/Skeleton';

export const AdminItemsPage = () => {
  const { data: items, isLoading, isError } = useQuery({ queryKey: ['adminItems'], queryFn: () => getItems() });

  if (isLoading) return <div className="max-w-7xl mx-auto p-8"><Skeleton className="h-96" /></div>;
  if (isError) return <div className="max-w-7xl mx-auto p-8 text-red-500">Failed to load items.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/admin" className="text-accent hover:underline">&larr; Back to Admin Dashboard</Link>
        <h1 className="text-3xl font-bold text-primary">Item Listings Management</h1>
      </div>
      
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-text">Title</th>
                <th className="p-3 text-text">Category</th>
                <th className="p-3 text-text">Condition</th>
                <th className="p-3 text-text">Daily Fee</th>
                <th className="p-3 text-text">Status</th>
                <th className="p-3 text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items && items.length > 0 ? (
                items.map(item => (
                  <tr key={item._id} className="border-b border-border hover:bg-background/50">
                    <td className="p-3 text-primary font-medium">
                      <Link to={`/items/${item._id}`} className="hover:underline">{item.title}</Link>
                    </td>
                    <td className="p-3 text-text">{item.category}</td>
                    <td className="p-3 text-text">{item.condition}</td>
                    <td className="p-3 text-primary font-semibold">${item.borrowingFee}/day</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {item.status || 'Available'}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link to={`/items/${item._id}`} className="text-accent text-sm hover:underline">View</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-text">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
