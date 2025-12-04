import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import axiosClient from '../../apis/axiosClient';
import { placeService } from '../../services/placeService';

const AdminTours = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'EGP',
    place: '',
    categories: '',
    tags: '',
    languages: '',
  });
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Handle language/direction changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLanguage = i18n.language;
      const direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = direction;
      document.documentElement.lang = currentLanguage;
    };

    handleLanguageChange();
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    fetchTours();
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoadingPlaces(true);
      const placesData = await placeService.getAllPlaces();
      setPlaces(placesData);
    } catch (err) {
      console.error('Error fetching places:', err);
      setPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/tours?limit=100');
      setTours(response.data.data || []);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError(t('admin.tours.loadError') || 'Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTour = () => {
    setEditingTour(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      currency: 'EGP',
      place: '',
      categories: '',
      tags: '',
      languages: '',
    });
    setShowModal(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name,
      description: tour.description || '',
      price: tour.price,
      currency: tour.currency || 'EGP',
      place: tour.place?._id || tour.place || '',
      categories: tour.categories?.join(', ') || '',
      tags: tour.tags?.join(', ') || '',
      languages: tour.languages?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData for consistency with backend multipart/form-data expectation
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('place', formData.place);
      
      // Add arrays as JSON strings
      const categories = formData.categories ? formData.categories.split(',').map(c => c.trim()).filter(c => c) : [];
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
      const languages = formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(l => l) : [];
      
      formDataToSend.append('categories', JSON.stringify(categories));
      formDataToSend.append('tags', JSON.stringify(tags));
      formDataToSend.append('languages', JSON.stringify(languages));

      if (editingTour) {
        await axiosClient.patch(`/tours/${editingTour._id}`, formDataToSend);
        setTours(
          tours.map((t) =>
            t._id === editingTour._id ? { ...editingTour, ...formData } : t
          )
        );
      } else {
        const response = await axiosClient.post('/tours', formDataToSend);
        setTours([...tours, response.data.data]);
      }
      setShowModal(false);
      setEditingTour(null);
    } catch (err) {
      console.error('Error saving tour:', err);
      console.error('Full error response:', err.response?.data);
      
      // Extract detailed error message
      let errorMessage = t('admin.tours.saveError') || 'Failed to save tour. ';
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Format validation errors
        const fieldErrors = err.response.data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
        errorMessage += '\n' + fieldErrors;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm(t('admin.tours.confirmDelete') || 'Are you sure?')) {
      try {
        await axiosClient.delete(`/tours/${id}`);
        setTours(tours.filter((t) => t._id !== id));
      } catch (err) {
        console.error('Error deleting tour:', err);
        setError(err.response?.data?.message || t('admin.tours.deleteError'));
      }
    }
  };

  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bgColor = isDarkMode ? 'bg-[#0F0E0C]' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-[#0F0E0C]' : 'bg-gray-50';
  const rowHover = isDarkMode ? 'hover:bg-[#2c1b0f]/50' : 'hover:bg-gray-50';

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
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${textColor}`}>{t('admin.tours.title')}</h1>
        <button
          onClick={handleAddTour}
          className="flex items-center gap-2 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
        >
          <FaPlus /> {t('admin.tours.add')}
        </button>
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
          placeholder={t('admin.tours.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
        />
      </div>

      {/* Tours Table */}
      <div className={`${cardBg} border ${borderColor} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor} ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-100'}`}>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.tours.name')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.tours.city')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.tours.price')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.tours.duration')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.tours.groupSize')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.tours.rating')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.tours.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <tr
                    key={tour._id}
                    className={`border-b ${borderColor} ${rowHover} transition-all`}
                  >
                    <td className={`px-6 py-3 ${textColor} font-medium`}>{tour.name}</td>
                    <td className={`px-6 py-3 ${secondaryText}`}>{tour.city}</td>
                    <td className={`px-6 py-3 text-[#D5B36A] font-semibold`}>
                      {tour.price} {tour.currency}
                    </td>
                    <td className={`px-6 py-3 ${secondaryText}`}>{tour.duration}h</td>
                    <td className={`px-6 py-3 ${secondaryText}`}>{tour.maxGroupSize}</td>
                    <td className={`px-6 py-3`}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
                        ★ {tour.ratingsAverage || 'N/A'}
                      </span>
                    </td>
                    <td className={`px-6 py-3`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTour(tour)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title={t('admin.edit')}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title={t('admin.delete')}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`px-6 py-8 text-center ${secondaryText}`}>
                    {searchTerm
                      ? t('admin.tours.notFound')
                      : t('admin.tours.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${cardBg} border ${borderColor} rounded-lg p-6 max-w-md w-full mx-4`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${textColor}`}>
                {editingTour
                  ? t('admin.tours.edit')
                  : t('admin.tours.addNew')}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`${secondaryText} hover:${textColor}`}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  {t('admin.tours.name')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  {t('admin.tours.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  {t('admin.tours.price')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.99"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  Place/Location
                </label>
                <select
                  required
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  disabled={loadingPlaces || places.length === 0}
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A] ${loadingPlaces || places.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">{loadingPlaces ? 'Loading places...' : 'Select a place'}</option>
                  {places.map((place) => (
                    <option key={place._id} value={place._id}>
                      {place.name} ({place.city}, {place.country})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  {t('admin.tours.currency')}
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
                >
                  <option>EGP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="e.g., Adventure, Cultural, Historical"
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., outdoor, guided, family-friendly"
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  placeholder="e.g., English, Arabic, French"
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
                >
                  {editingTour ? t('admin.tours.update') : t('admin.tours.create')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-4 py-2 bg-gray-600 ${textColor} rounded-lg hover:bg-gray-700 transition-all`}
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTours;
