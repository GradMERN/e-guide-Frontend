import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      // Redirect based on role
      if (response.data.role === 'admin' || response.data.role === 'guide') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B1A17] to-[#2c1b0f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#1B1A17] p-10 rounded-2xl shadow-2xl border border-[#D5B36A]/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-[#D5B36A]" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-[#D5B36A]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="Password"
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

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-[#D5B36A]/30 text-[#D5B36A] focus:ring-[#D5B36A]"
              />
              <span className="ml-2 text-sm text-gray-400">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#D5B36A] hover:text-[#E2C784]"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-semibold rounded-lg hover:from-[#B8924F] hover:to-[#DCC07C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D5B36A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#D5B36A] hover:text-[#E2C784]">
                Create one
              </Link>
            </p>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 pt-6 border-t border-[#D5B36A]/20">
          <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials:</p>
          <div className="space-y-2 text-xs text-gray-400">
            <p><strong className="text-[#D5B36A]">Admin:</strong> admin.user@gmail.com / ADmin@!123456</p>
            <p><strong className="text-[#D5B36A]">Guide:</strong> ahmed.guide@gmail.com / Guide@!123456</p>
            <p><strong className="text-[#D5B36A]">User:</strong> john.doe@gmail.com / User@!123456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
