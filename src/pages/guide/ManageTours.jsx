import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';

const ManageTours = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [tours, setTours] = useState([
    {
      id: 1,
      name: 'Pyramids of Giza Tour',
      city: 'Cairo',
      price: 1500,
      duration: 4,
      maxGroupSize: 15,
      rating: 4.8,
      status: 'active',
      bookings: 12,
      views: 245,
    },
    {
      id: 2,
      name: 'Nile River Cruise',
      city: 'Cairo',
      price: 2500,
      duration: 3,
      maxGroupSize: 20,
      rating: 4.9,
      status: 'active',
      bookings: 18,
      views: 380,
    },
    {
      id: 3,
      name: 'Desert Safari Adventure',
      city: 'Giza',
      price: 1200,
      duration: 6,
      maxGroupSize: 10,
      rating: 4.7,
      status: 'active',
      bookings: 8,
      views: 156,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    price: '',
    duration: '',
    maxGroupSize: '',
  });

  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50';
  const inputBorder = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-300';

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

  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTour = () => {
    setEditingTour(null);
    setFormData({
      name: '',
      city: '',
      price: '',
      duration: '',
      maxGroupSize: '',
    });
    setShowModal(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name,
      city: tour.city,
      price: tour.price,
      duration: tour.duration,
      maxGroupSize: tour.maxGroupSize,
    });
    setShowModal(true);
  };

  const handleDeleteTour = (id) => {
    if (window.confirm(t('admin.tours.confirmDelete'))) {
      setTours(tours.filter((tour) => tour.id !== id));
    }
  };

  const handleSaveTour = () => {
    if (editingTour) {
      setTours(
        tours.map((tour) =>
          tour.id === editingTour.id ? { ...tour, ...formData } : tour
        )
      );
    } else {
      setTours([
        ...tours,
        {
          id: Math.max(...tours.map((t) => t.id), 0) + 1,
          ...formData,
          rating: 0,
          status: 'active',
          bookings: 0,
          views: 0,
        },
      ]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>{t('guide.tours.title')}</h1>
          <p className={`${secondaryText} mt-1`}>Manage and track all your tours</p>
        </div>
        <button
          onClick={handleAddTour}
          className="flex items-center gap-2 bg-[#D5B36A] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#C7A15C] transition-all"
        >
          <FaPlus /> {t('guide.tours.add')}
        </button>
      </div>

      {/* Search Bar */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-4`}>
        <div className="flex items-center gap-3">
          <FaSearch className={secondaryText} />
          <input
            type="text"
            placeholder={t('guide.tours.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent ${textColor} placeholder-${secondaryText} border-0 outline-none`}
          />
        </div>
      </div>

      {/* Tours Table */}
      <div className={`${cardBg} rounded-xl border ${borderColor} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor} bg-opacity-50`}>
                <th className={`text-left py-4 px-6 font-semibold ${secondaryText}`}>
                  {t('guide.tours.name')}
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${secondaryText}`}>
                  {t('guide.tours.city')}
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${secondaryText}`}>
                  {t('guide.tours.price')}
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${secondaryText}`}>
                  {t('guide.tours.duration')}
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${secondaryText}`}>
                  {t('guide.tours.rating')}
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${secondaryText}`}>
                  {t('guide.tours.bookings')}
                </th>
                <th className={`text-left py-4 px-6 font-semibold ${secondaryText}`}>
                  {t('guide.tours.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <tr key={tour.id} className={`border-b ${borderColor} hover:${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} transition-colors`}>
                    <td className={`py-4 px-6 ${textColor} font-medium`}>{tour.name}</td>
                    <td className={`py-4 px-6 ${secondaryText}`}>{tour.city}</td>
                    <td className={`py-4 px-6 ${textColor}`}>{tour.price} EGP</td>
                    <td className={`py-4 px-6 ${secondaryText}`}>{tour.duration}h</td>
                    <td className={`py-4 px-6`}>
                      <span className="text-yellow-400">★ {tour.rating}</span>
                    </td>
                    <td className={`py-4 px-6 ${textColor}`}>{tour.bookings}</td>
                    <td className={`py-4 px-6`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTour(tour)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-all"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-all"
                          title="View"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`py-8 text-center ${secondaryText}`}>
                    {t('guide.tours.notFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl border ${borderColor} p-8 max-w-md w-full`}>
            <h2 className={`text-2xl font-bold ${textColor} mb-6`}>
              {editingTour ? t('guide.tours.edit') : t('guide.tours.addNew')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                  {t('guide.tours.name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg ${textColor}`}
                />
              </div>
              <div>
                <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                  {t('guide.tours.city')}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg ${textColor}`}
                />
              </div>
              <div>
                <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                  {t('guide.tours.price')}
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg ${textColor}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                    {t('guide.tours.duration')}
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg ${textColor}`}
                  />
                </div>
                <div>
                  <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                    Max Group
                  </label>
                  <input
                    type="number"
                    value={formData.maxGroupSize}
                    onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                    className={`w-full px-4 py-2 ${inputBg} border ${inputBorder} rounded-lg ${textColor}`}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} transition-all`}
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={handleSaveTour}
                className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg font-semibold hover:bg-[#C7A15C] transition-all"
              >
                {t('admin.edit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTours;
