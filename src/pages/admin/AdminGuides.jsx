import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaPhone, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../apis/axiosClient';

const AdminGuides = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [guideTours, setGuideTours] = useState({});

  // Theme detection
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(storedTheme === 'dark');

    const handleThemeChange = () => {
      const theme = localStorage.getItem('theme') || 'dark';
      setIsDarkMode(theme === 'dark');
    };

    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/admin');
      const guidesList = response.data.data.filter((user) => user.role === 'guide');
      setGuides(guidesList);

      // Fetch tours for each guide
      for (const guide of guidesList) {
        try {
          const toursResponse = await axiosClient.get(`/tours/guide/${guide._id}`);
          setGuideTours((prev) => ({
            ...prev,
            [guide._id]: toursResponse.data.data || [],
          }));
        } catch (err) {
          console.error(`Error fetching tours for guide ${guide._id}:`, err);
        }
      }
    } catch (err) {
      console.error('Error fetching guides:', err);
      setError(t('admin.guides.loadError') || 'Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(
    (guide) =>
      guide.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guide.city && guide.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const bgColor = isDarkMode ? 'bg-[#0F0E0C]' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-[#0F0E0C]' : 'bg-gray-50';
  const statsBg = isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-100';

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${bgColor}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p className={textColor}>{t('admin.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${textColor} mb-2`}>{t('admin.guides.title')}</h1>
        <p className={secondaryText}>{t('admin.guides.subtitle')}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
        <input
          type="text"
          placeholder={t('admin.guides.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <p className={`${secondaryText} text-sm mb-1`}>{t('admin.guides.totalGuides')}</p>
          <p className="text-2xl font-bold text-green-500">{guides.length}</p>
        </div>
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <p className={`${secondaryText} text-sm mb-1`}>{t('admin.guides.activeGuides')}</p>
          <p className="text-2xl font-bold text-blue-500">
            {guides.filter((g) => (guideTours[g._id] || []).length > 0).length}
          </p>
        </div>
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <p className={`${secondaryText} text-sm mb-1`}>{t('admin.guides.totalTours')}</p>
          <p className="text-2xl font-bold text-amber-500">
            {Object.values(guideTours).reduce((sum, tours) => sum + tours.length, 0)}
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <div
              key={guide._id}
              className={`${cardBg} border ${borderColor} rounded-lg p-6 hover:border-[#D5B36A]/50 transition-all`}
            >
              {/* Guide Avatar and Name */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-lg">
                    {guide.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p className={`${textColor} font-semibold`}>
                      {guide.firstName} {guide.lastName}
                    </p>
                    <p className={`text-xs ${secondaryText}`}>{guide.age} years old</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className={`space-y-2 mb-4 pb-4 border-b ${borderColor}`}>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaPhone className="text-[#D5B36A]" />
                  <span>{guide.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaMapMarkedAlt className="text-[#D5B36A]" />
                  <span>{guide.city || 'N/A'}, {guide.country || 'N/A'}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{guide.email}</p>
              </div>

              {/* Tours and Rating */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`${statsBg} rounded-lg p-3 text-center`}>
                  <p className="text-2xl font-bold text-[#D5B36A]">
                    {(guideTours[guide._id] || []).length}
                  </p>
                  <p className={`text-xs ${secondaryText}`}>{t('admin.guides.tours')}</p>
                </div>
                <div className={`${statsBg} rounded-lg p-3 text-center`}>
                  <p className="flex items-center justify-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                      {guide.ratingsAverage || '4.5'}
                    </span>
                  </p>
                  <p className={`text-xs ${secondaryText}`}>{t('admin.guides.rating')}</p>
                </div>
              </div>

              {/* Recent Tours */}
              {(guideTours[guide._id] || []).length > 0 && (
                <div>
                  <p className={`text-sm font-semibold ${secondaryText} mb-2`}>
                    {t('admin.guides.recentTours')}
                  </p>
                  <div className="space-y-1">
                    {(guideTours[guide._id] || []).slice(0, 3).map((tour) => (
                      <p key={tour._id} className={`text-xs ${secondaryText} truncate`}>
                        • {tour.name} ({tour.city})
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className={secondaryText}>
              {searchTerm
                ? t('admin.guides.notFound')
                : t('admin.guides.empty')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuides;
