
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { AriseLogoIcon, GoogleIcon } from '../components/shared/Icons';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'employee' | 'client'>('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleNavigate = (path: string) => {
    setFadeIn(false);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required.');
        return;
    }

    setLoading(true);
    try {
      await authService.register({ ...formData, role });
      showToast(`Registration successful for ${formData.name}!`, 'success');
      // Log in the user after registration
      const data = await authService.login({ email: formData.email, password: formData.password });
      auth.login(data.user);
      if (data.user.role === 'employee') {
        handleNavigate('/dashboard');
      } else {
        handleNavigate('/client-dashboard');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    showToast('Simulating Google Sign-Up...', 'info');
    setTimeout(() => {
        auth.login({ id: 'google-user-1', username: 'Google User', email: 'google@example.com', role, clientId: role === 'client' ? 'c7a4c5a3-4a7c-4c4c-8a0a-4a2c7c7d7e3a' : undefined });
        handleNavigate(role === 'employee' ? '/dashboard' : '/client-dashboard');
    }, 1000);
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background p-4 transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <AriseLogoIcon className="h-16 w-16 mx-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-text-primary">
            Create an Account
          </h2>
          <p className="text-text-secondary">Join Arise CRM to get started</p>
        </div>

        <div className="flex justify-center bg-background rounded-lg p-1">
            <button 
                onClick={() => setRole('employee')}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${role === 'employee' ? 'bg-primary text-on_primary shadow' : 'text-text-secondary'}`}>
                I'm an Employee
            </button>
            <button 
                onClick={() => setRole('client')}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${role === 'client' ? 'bg-primary text-on_primary shadow' : 'text-text-secondary'}`}>
                I'm a Client
            </button>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-text-primary">
              Full Name
            </label>
            <input id="name" name="name" type="text" required onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition"
              placeholder="Your Full Name" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              Email Address
            </label>
            <input id="email" name="email" type="email" required onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition"
              placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-text-primary">
              Password
            </label>
            <input id="password" name="password" type="password" required onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition"
              placeholder="••••••••" />
          </div>

          {error && <p className="text-sm text-danger text-center">{error}</p>}

          <div>
            <button type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-on_primary bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-surface text-text-secondary">Or sign up with</span></div>
        </div>

        <div>
            <button type="button" onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-text-primary bg-surface hover:bg-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-transform transform hover:scale-105">
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>
        </div>

         <p className="text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-secondary hover:text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
