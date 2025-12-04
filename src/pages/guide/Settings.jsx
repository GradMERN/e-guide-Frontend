import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaUser, FaPhone, FaMapMarkerAlt, FaUpload, FaSave } from 'react-icons/fa';
import axios from 'axios';

const GuidSettings = () => {
  const { user, isDarkMode } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    city: user?.city || '',
    avatar: user?.avatar || '',
  });
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');

  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
        setProfileData(prev => ({ ...prev, avatar: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);

      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add text fields
      Object.keys(profileData).forEach(key => {
        if (key !== 'avatar' && profileData[key]) {
          formData.append(key, profileData[key]);
        }
      });

      // Add avatar if it's a file
      if (profileData.avatar instanceof File) {
        formData.append('avatar', profileData.avatar);
      }

      const response = await axios.put(
        'http://localhost:3000/api/users/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update localStorage
      const updatedUser = { ...user, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0d0c0a]' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>
            {t('guide.settings.title') || 'Settings'}
          </h1>
          <p className={secondaryText}>
            {t('guide.settings.description') || 'Manage your profile and account settings'}
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Settings Card */}
        <div className={`${cardBg} rounded-xl border ${borderColor} p-8 shadow-lg`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6 pb-8 border-b border-[#D5B36A]/20">
              <div className="relative">
                <img 
                  src={previewAvatar || 'https://via.placeholder.com/120?text=Avatar'}
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-[#D5B36A]"
                />
                <label className="absolute bottom-0 right-0 bg-[#D5B36A] text-black p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition">
                  <FaUpload size={18} />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-center">
                <p className={`font-medium ${textColor}`}>
                  {profileData.firstName} {profileData.lastName}
                </p>
                <p className={secondaryText}>{t('user.role') || 'Tour Guide'}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className={`text-xl font-bold ${textColor} mb-6 flex items-center gap-2`}>
                <FaUser className="text-[#D5B36A]" />
                {t('guide.settings.personalInfo') || 'Personal Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                    {t('common.firstName') || 'First Name'}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} 
                              ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                    {t('common.lastName') || 'Last Name'}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} 
                              ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                  {t('common.email') || 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} 
                            ${inputBg} ${textColor} opacity-60 cursor-not-allowed`}
                />
                <p className={`text-xs ${secondaryText} mt-2`}>
                  {t('guide.settings.emailReadOnly') || 'Email cannot be changed'}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className={`text-xl font-bold ${textColor} mb-6 flex items-center gap-2`}>
                <FaPhone className="text-[#D5B36A]" />
                {t('guide.settings.contactInfo') || 'Contact Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                    {t('common.phone') || 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="+20 123 456 7890"
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} 
                              ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                    {t('common.country') || 'Country'}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    placeholder="Egypt"
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} 
                              ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                  <FaMapMarkerAlt className="inline mr-2 text-[#D5B36A]" />
                  {t('common.city') || 'City'}
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  placeholder="Cairo"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} 
                            ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 pt-8 border-t border-[#D5B36A]/20">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#D5B36A] text-black rounded-lg 
                         hover:bg-[#E2C784] transition-all font-medium flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                {loading ? 'Saving...' : t('common.save') || 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setProfileData({
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  country: user?.country || '',
                  city: user?.city || '',
                  avatar: user?.avatar || '',
                })}
                className={`flex-1 px-6 py-3 rounded-lg border ${borderColor}
                         ${textColor} hover:bg-[#D5B36A]/10 transition-all font-medium`}
              >
                {t('common.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className={`${cardBg} rounded-xl border ${borderColor} p-6 mt-8`}>
          <h3 className={`text-lg font-bold ${textColor} mb-4`}>
            {t('guide.settings.accountInfo') || 'Account Information'}
          </h3>
          <div className={`space-y-2 ${secondaryText} text-sm`}>
            <p>• {t('guide.settings.joinDate') || 'Member since'}: {new Date().toLocaleDateString()}</p>
            <p>• {t('guide.settings.accountStatus') || 'Status'}: Active</p>
            <p>• {t('guide.settings.verificationStatus') || 'Email Verification'}: Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidSettings;
