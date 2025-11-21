import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
          <h2 className="text-2xl font-bold text-white mb-4">Password Reset Successful!</h2>
          <p className="text-gray-400 mb-6">
            Your password has been reset. You can now log in with your new password.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
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
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-300">New Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#D5B36A]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#D5B36A] hover:text-[#E2C784]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#D5B36A]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#D5B36A] hover:text-[#E2C784]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-semibold rounded-lg hover:from-[#B8924F] hover:to-[#DCC07C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D5B36A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
