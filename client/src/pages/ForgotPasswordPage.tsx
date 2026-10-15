import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Bot, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset password form state (when testing token)
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setSubmitted(true);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetLoading(true);

    try {
      if (!resetToken) throw new Error('Reset token is missing');
      await authService.resetPassword({ token: resetToken, newPassword });
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
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

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!submitted ? (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900">Reset Password</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter your account email to receive reset instructions
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
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
                    placeholder="name@example.com"
                    required
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
              </button>
            </form>
          </>
        ) : resetSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Password Changed!</h2>
              <p className="text-sm text-slate-500 mt-1">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block mt-2 py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <div className="py-2 space-y-4">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Reset Request Received</h2>
              <p className="text-sm text-slate-500 mt-1">
                Instructions processed for <span className="font-semibold text-slate-800">{email}</span>.
              </p>
            </div>

            {/* Set New Password directly */}
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Set New Password Now
              </h3>
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    minLength={6}
                    required
                    className="w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {resetLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{resetLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
