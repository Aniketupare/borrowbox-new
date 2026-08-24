import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm col-span-1">
          <div className="w-24 h-24 rounded-full bg-border mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary text-center">{user?.name}</h2>
          <p className="text-text text-center text-sm">{user?.role}</p>
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-primary mb-4">Account Information</h2>
            <div className="space-y-2 text-sm text-text">
              <p>Email: {user?.email}</p>
            </div>
            <Button variant="outline" className="mt-4">Edit Profile</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link to="/listings" className="p-4 bg-surface rounded-xl border border-border text-center hover:bg-background">My Listings</Link>
            <Link to="/bookings" className="p-4 bg-surface rounded-xl border border-border text-center hover:bg-background">My Bookings</Link>
            <Link to="/notifications" className="p-4 bg-surface rounded-xl border border-border text-center hover:bg-background">Notifications</Link>
            <Link to="/messages" className="p-4 bg-surface rounded-xl border border-border text-center hover:bg-background">Messages</Link>
          </div>

          <Button variant="outline" className="text-red-600 border-red-600 w-full" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

