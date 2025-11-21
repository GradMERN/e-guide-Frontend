import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B1A17] to-[#2c1b0f] py-12 px-4">
        <div className="max-w-md w-full bg-[#1B1A17] p-10 rounded-2xl shadow-2xl border border-[#D5B36A]/20 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
          <p className="text-gray-400 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your email and click the link to reset your password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 bg-[#D5B36A] text-black font-semibold rounded-lg hover:bg-[#E2C784] transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B1A17] to-[#2c1b0f] py-12 px-4">
      <div className="max-w-md w-full bg-[#1B1A17] p-10 rounded-2xl shadow-2xl border border-[#D5B36A]/20">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-[#D5B36A] hover:text-[#E2C784] mb-6"
        >
          <FaArrowLeft /> Back to Login
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-[#D5B36A]" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-semibold rounded-lg hover:from-[#B8924F] hover:to-[#DCC07C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D5B36A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-[#D5B36A] hover:text-[#E2C784]">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
