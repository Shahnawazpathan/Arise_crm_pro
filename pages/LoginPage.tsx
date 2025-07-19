
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { AriseLogoIcon, GoogleIcon } from '../components/shared/Icons';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const [loginType, setLoginType] = useState<'employee' | 'client'>('employee');
  const [email, setEmail] = useState(loginType === 'employee' ? 'employee@arise.com' : 'client@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const { showToast } = useToast();

  const handleLoginTypeChange = (type: 'employee' | 'client') => {
    setLoginType(type);
    setEmail(type === 'employee' ? 'employee@arise.com' : 'client@example.com');
    setPassword('password123');
    setError('');
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let userLoggedIn = false;

    if (loginType === 'employee' && email === 'employee@arise.com' && password === 'password123') {
      auth.login({ id: '1', username: 'Mohd. Ibraheem', email: email, role: 'employee' });
      navigate('/dashboard');
      userLoggedIn = true;
    } else if (loginType === 'client' && email === 'client@example.com' && password === 'password123') {
      auth.login({ id: '2', username: 'Farhan Ahmed', email: email, role: 'client', clientId: 'c7a4c5a3-4a7c-4c4c-8a0a-4a2c7c7d7e3a' });
      navigate('/client-dashboard');
      userLoggedIn = true;
    }

    if (!userLoggedIn) {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  const handleGoogleLogin = () => {
      showToast('Simulating Google Sign-In...', 'info');
      // Simulate successful login after a short delay
      setTimeout(() => {
        if (loginType === 'employee') {
            auth.login({ id: '1', username: 'Mohd. Ibraheem', email: 'employee@arise.com', role: 'employee' });
            navigate('/dashboard');
        } else {
             auth.login({ id: '2', username: 'Farhan Ahmed', email: 'client@example.com', role: 'client', clientId: 'c7a4c5a3-4a7c-4c4c-8a0a-4a2c7c7d7e3a' });
            navigate('/client-dashboard');
        }
      }, 1000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <AriseLogoIcon className="h-16 w-16 mx-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-text-primary">
            Welcome Back
          </h2>
          <p className="text-text-secondary">Sign in to continue to Arise CRM</p>
        </div>

        <div className="flex justify-center bg-background rounded-lg p-1">
            <button 
                onClick={() => handleLoginTypeChange('employee')}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${loginType === 'employee' ? 'bg-primary text-on_primary shadow' : 'text-text-secondary'}`}>
                Employee Portal
            </button>
            <button 
                onClick={() => handleLoginTypeChange('client')}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${loginType === 'client' ? 'bg-primary text-on_primary shadow' : 'text-text-secondary'}`}>
                Client Portal
            </button>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password"className="text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-danger text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-on_primary bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
            </div>
        </div>

        <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-text-primary bg-surface hover:bg-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-transform transform hover:scale-105"
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>
        </div>

         <p className="text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-secondary hover:text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;