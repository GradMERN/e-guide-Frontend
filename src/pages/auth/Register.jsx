// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'Egypt',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.age < 13 || formData.age > 100) {
      setError('Age must be between 13 and 100');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registrationData } = formData;
      registrationData.age = parseInt(registrationData.age);
      
      await register(registrationData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-400 mb-6">
            Please check your email to verify your account.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B1A17] to-[#2c1b0f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-[#1B1A17] p-10 rounded-2xl shadow-2xl border border-[#D5B36A]/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Join us to explore the wonders of Egypt
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-300">First Name</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-[#D5B36A]" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                  placeholder="First name"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-300">Last Name</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-[#D5B36A]" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className="text-sm font-medium text-gray-300">Age</label>
              <input
                type="number"
                name="age"
                required
                min="13"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="Age"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-[#D5B36A]" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                  placeholder="+20 1234567890"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country */}
            <div>
              <label className="text-sm font-medium text-gray-300">Country</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-[#D5B36A]" />
                </div>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                  placeholder="Country"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-medium text-gray-300">City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="City"
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
                placeholder="Create password"
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

          {/* Confirm Password */}
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
                className="block w-full pl-10 pr-3 py-3 border border-[#D5B36A]/30 rounded-lg bg-[#2c1b0f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-semibold rounded-lg hover:from-[#B8924F] hover:to-[#DCC07C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D5B36A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
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

export default Register;