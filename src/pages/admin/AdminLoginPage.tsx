import React, { useState } from 'react';
import fetchData from '../../Api/FetchApi';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData<{ token: string; user: any }>(
        'admin/auth/login',
        'POST',
        {
          identifier: email,
          password: password,
        }
      );
      // You can handle token/user here, e.g. save to localStorage
       localStorage.setItem('token', data.token);
      // Redirect to admin dashboard if needed
       window.location.href = '/#/admin';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F4F7] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#EAECF0] overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4">
              <LockClosedIcon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-[#101828]">Admin Login</h2>
            <p className="text-[#667085] mt-2 text-sm">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={e => { e.preventDefault(); handleLogin(); }} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1.5" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-[#98A2B3]" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2] sm:text-sm transition-all"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-[#98A2B3]" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2] sm:text-sm transition-all"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-[#F9FAFB] border-t border-[#EAECF0] text-center">
          <p className="text-xs text-[#667085]">
            &copy; {new Date().getFullYear()} CloudTech. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
