import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiClient } from '../api/apiClient';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token || !email) {
      setError('Invalid or missing password reset link parameters.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/reset-password', {
        email,
        token,
        password: formData.password
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-surface border border-border rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-primary mb-6">Reset Password</h2>
      
      {isSubmitted ? (
        <div className="text-center">
          <p className="text-text mb-6">Your password has been successfully reset.</p>
          <Link to="/login" className="text-accent font-semibold">Proceed to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Input 
              label="New Password" 
              type={showPassword ? 'text' : 'password'} 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-sm text-text hover:text-primary"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <Input 
            label="Confirm New Password" 
            type={showPassword ? 'text' : 'password'} 
            value={formData.confirmPassword} 
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
            required 
          />
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
          
          <Link to="/login" className="text-center text-sm text-text hover:text-primary mt-4">&larr; Back to Login</Link>
        </form>
      )}
    </div>
  );
};
