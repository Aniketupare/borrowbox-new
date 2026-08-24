import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log('[NAVBAR] isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin, 'isLoading:', isLoading);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Browse', path: '/browse' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  return (
    <nav className="sticky top-0 bg-surface z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="font-bold text-2xl text-primary">BorrowBox</Link>
          
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="text-text hover:text-primary">{link.name}</Link>
            ))}
            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 text-primary">{theme === 'light' ? '🌙' : '☀️'}</button>
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="text-text hover:text-primary">
                    {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="text-text hover:text-primary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-text hover:text-primary">Login</Link>
                  <Link to="/register" className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover">Sign Up</Link>
                </>
              )
            )}
          </div>
          
          <button 
            className="md:hidden text-primary p-2" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-surface p-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="text-primary font-medium" onClick={() => setIsOpen(false)}>{link.name}</Link>
          ))}
          <button onClick={toggleTheme} className="text-primary font-medium text-left">Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
          {!isLoading && (
            isAuthenticated ? (
              <>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="text-primary font-bold" onClick={() => setIsOpen(false)}>
                  {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="text-primary font-bold text-left">Logout</button>
              </>
            ) : (
              <Link to="/register" className="text-accent font-bold" onClick={() => setIsOpen(false)}>Sign Up</Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};
