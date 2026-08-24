import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const formatRegistrationError = (err: any): string => {
    const rawMsg = err.response?.data?.message || err.message || '';
    
    // Check if it's a JSON string representing Zod errors
    try {
      const parsed = JSON.parse(rawMsg);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstErr = parsed[0];
        const msg = firstErr.message || '';
        const path = firstErr.path?.[0] || '';

        if (msg.toLowerCase().includes('password') || path === 'password') {
          if (firstErr.code === 'too_small') {
            return 'Password must be at least 6 characters.';
          }
          return msg;
        }
        if (msg.toLowerCase().includes('email') || path === 'email') {
          return 'Please enter a valid email address.';
        }
        if (msg) return msg;
      }
    } catch {
      // Not JSON
    }

    const lower = rawMsg.toLowerCase();
    if (lower.includes('user already exists') || lower.includes('email already')) {
      return 'An account with this email already exists.';
    }
    if (lower.includes('password') && lower.includes('6')) {
      return 'Password must be at least 6 characters.';
    }
    if (lower.includes('email') || lower.includes('valid email')) {
      return 'Please enter a valid email address.';
    }
    if (lower.includes('required') || lower.includes('fill in')) {
      return 'Please fill in all required fields.';
    }

    if (rawMsg && !rawMsg.startsWith('[') && !rawMsg.includes('{')) {
      return rawMsg;
    }

    return 'Unable to create your account. Please try again.';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (Object.values(formData).some(field => !field)) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        location: { type: 'Point', coordinates: [0, 0] } // Default placeholder
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(formatRegistrationError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-surface border border-border rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-primary mb-6">Create Account</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <div className="relative">
          <Input 
            label="Password" 
            type={showPassword ? 'text' : 'password'} 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
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
          label="Confirm Password" 
          type={showPassword ? 'text' : 'password'} 
          value={formData.confirmPassword} 
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
        />
        <Input label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-text">Already have an account? <Link to="/login" className="text-accent font-semibold">Login</Link></p>
        <Link to="/" className="inline-block mt-4 text-text hover:text-primary">&larr; Back to Home</Link>
      </div>
    </div>
  );
};
