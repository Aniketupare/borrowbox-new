import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      
      const { data: userData } = await apiClient.get('/auth/me');
      
      const destination = userData.role === 'admin' ? '/admin' : '/';
      navigate(destination, { replace: true });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-surface border border-border rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-primary mb-6">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <Input 
            label="Password" 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-sm text-text hover:text-primary"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <Link to="/forgot-password" className="text-sm text-text hover:text-primary">Forgot password?</Link>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-text">Don't have an account? <Link to="/register" className="text-accent font-semibold">Sign Up</Link></p>
        <Link to="/" className="inline-block mt-4 text-text hover:text-primary">&larr; Back to Home</Link>
      </div>
    </div>
  );
};
