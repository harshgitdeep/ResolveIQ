import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Bot, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route user based on their role
      if (user.role === 'customer') {
        navigate('/portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md mb-3">
          <Bot className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ResolveIQ</h2>
        <p className="text-sm text-slate-500 mt-1">Customer Support & Ticketing</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Sign In</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="harsh@example.com"
                required
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-slate-400">or</span>
          </div>
        </div>

        {/* New user / Sign up prompt */}
        <div className="text-center text-sm text-slate-600">
          <span>New user? </span>
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Demo Credentials Helper Card */}
      <div className="mt-6 w-full max-w-md bg-white/70 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 shadow-2xs">
        <span className="font-semibold text-slate-800">Test Accounts:</span>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div>
            <span className="text-slate-500">Customer: </span>
            <button
              type="button"
              onClick={() => {
                setEmail('harsh@example.com');
                setPassword('Password123!');
              }}
              className="text-blue-600 hover:underline font-mono cursor-pointer"
            >
              harsh@example.com
            </button>
          </div>
          <div>
            <span className="text-slate-500">Agent: </span>
            <button
              type="button"
              onClick={() => {
                setEmail('priya.agent@example.com');
                setPassword('Password123!');
              }}
              className="text-blue-600 hover:underline font-mono cursor-pointer"
            >
              priya.agent@example.com
            </button>
          </div>
        </div>
        <div className="mt-1 text-[10px] text-slate-400">
          Password: <span className="font-mono text-slate-600">Password123!</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
