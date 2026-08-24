import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiClient } from '../api/apiClient';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-surface border border-border rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-primary mb-6">Forgot Password</h2>
      
      {isSubmitted ? (
        <div className="text-center">
          <p className="text-text mb-6">If an account exists for {email}, you will receive a password reset link shortly.</p>
          <Link to="/login" className="text-accent font-semibold">Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-text mb-4">Enter your email address to receive a password reset link.</p>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <Link to="/login" className="text-center text-sm text-text hover:text-primary mt-4">&larr; Back to Login</Link>
        </form>
      )}
    </div>
  );
};
