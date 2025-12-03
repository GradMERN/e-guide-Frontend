import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../i18n';
import { guideService } from '../../services/guideService';
import { placeService } from '../../services/placeService';
import StatsOverview from '../../components/analytics/StatsOverview';
import ChartComponent from '../../components/analytics/ChartComponent';
import {
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaStar,
  FaPlus,
  FaTimes,
  FaBoxOpen,
} from 'react-icons/fa';

const GuideDashboard = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [myTours, setMyTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [newTourForm, setNewTourForm] = useState({
    name: '',
    description: '',
    price: '',
    place: '',
    categories: '',
    tags: '',
    languages: '',
  });

  useEffect(() => {
    fetchDashboardData();
    fetchPlaces();
    fetchMyTours();
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

  const fetchMyTours = async () => {
    try {
      setLoadingTours(true);
      const response = await guideService.getMyTours(1, 100);
      setMyTours(response.data || []);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setMyTours([]);
    } finally {
      setLoadingTours(false);
    }
  };

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch guide's tours
      const toursRes = await guideService.getMyTours(1, 100);
      const tours = toursRes.data || [];
      
      // Generate mock data based on tours
      const totalTours = tours.length || 12;
      const activeTours = Math.floor(totalTours * 0.65);
      
      setDashboardData({
        totalTours,
        activeTours,
        totalBookings: Math.floor(Math.random() * 100) + 30,
        totalEarnings: Math.floor(Math.random() * 50000) + 10000,
        averageRating: 4.8,
        bookingTrend: generateBookingTrend(),
        earningsTrend: generateEarningsTrend(),
        tourPerformance: generateTourPerformance(tours),
        recentBookings: generateRecentBookings(),
      });
    } catch (err) {
      console.error('Error fetching guide dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set default data
      setDashboardData({
        totalTours: 12,
        activeTours: 8,
        totalBookings: 45,
        totalEarnings: 28500,
        averageRating: 4.8,
        bookingTrend: generateBookingTrend(),
        earningsTrend: generateEarningsTrend(),
        tourPerformance: [
          { name: 'Nile Cruise', value: 15, bookings: 18 },
          { name: 'Pyramids Tour', value: 25, bookings: 22 },
          { name: 'Desert Safari', value: 20, bookings: 16 },
          { name: 'City Tour', value: 12, bookings: 14 },
          { name: 'Temples Tour', value: 28, bookings: 20 },
        ],
        recentBookings: generateRecentBookings(),
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBookingTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      bookings: Math.floor(3 + idx * 1.2 + Math.random() * 2)
    }));
  };

  const generateEarningsTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      earnings: 3000 + idx * 1200 + Math.random() * 2000
    }));
  };

  const generateTourPerformance = (tours) => {
    const tourNames = ['Nile Cruise', 'Pyramids Tour', 'Desert Safari', 'City Tour', 'Temples Tour'];
    return tourNames.slice(0, Math.min(5, tours.length || 5)).map((name, idx) => ({
      name,
      value: Math.floor(Math.random() * 30) + 10,
      bookings: Math.floor(Math.random() * 25) + 10
    }));
  };

  const generateRecentBookings = () => {
    return [
      {
        id: 1,
        tourName: 'Pyramids Tour',
        guestName: 'John Doe',
        date: '2024-06-15',
        amount: '1,500',
        status: 'Completed'
      },
      {
        id: 2,
        tourName: 'Nile Cruise',
        guestName: 'Sarah Johnson',
        date: '2024-06-14',
        amount: '1,200',
        status: 'Completed'
      },
      {
        id: 3,
        tourName: 'Desert Safari',
        guestName: 'Ahmed Hassan',
        date: '2024-06-13',
        amount: '1,800',
        status: 'Pending'
      },
      {
        id: 4,
        tourName: 'City Tour',
        guestName: 'Fatima Mohamed',
        date: '2024-06-12',
        amount: '900',
        status: 'Completed'
      },
      {
        id: 5,
        tourName: 'Temples Tour',
        guestName: 'Mike Wilson',
        date: '2024-06-11',
        amount: '2,100',
        status: 'Completed'
      }
    ];
  };

  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  const handleAddTourChange = (e) => {
    const { name, value } = e.target;
    setNewTourForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTourSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate inputs before submitting
      if (!newTourForm.name || newTourForm.name.length < 3 || newTourForm.name.length > 100) {
        alert('Tour name must be between 3 and 100 characters');
        return;
      }
      
      if (!newTourForm.description || newTourForm.description.length < 10 || newTourForm.description.length > 2000) {
        alert('Description must be between 10 and 2000 characters');
        return;
      }
      
      if (!newTourForm.price || parseFloat(newTourForm.price) < 0.99) {
        alert('Price must be at least 0.99');
        return;
      }
      
      if (!newTourForm.place) {
        alert('Please select a place/location');
        return;
      }

      // Call API to add tour
      const tourData = {
        name: newTourForm.name,
        description: newTourForm.description,
        price: parseFloat(newTourForm.price),
        place: newTourForm.place,
        categories: newTourForm.categories ? newTourForm.categories.split(',').map(c => c.trim()).filter(c => c) : [],
        tags: newTourForm.tags ? newTourForm.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        languages: newTourForm.languages ? newTourForm.languages.split(',').map(l => l.trim()).filter(l => l) : [],
      };
      
      console.log('Submitting tour data:', tourData);
      await guideService.createTour(tourData);
      
      // Reset form and close modal
      setNewTourForm({
        name: '',
        description: '',
        price: '',
        place: '',
        categories: '',
        tags: '',
        languages: '',
      });
      setShowAddTourModal(false);
      
      // Refresh dashboard data
      fetchDashboardData();
      alert('Tour created successfully!');
    } catch (err) {
      console.error('Error creating tour:', err);
      console.error('Full error response:', err.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create tour. ';
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Format validation errors
        const fieldErrors = err.response.data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
        errorMessage += '\n' + fieldErrors;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += 'Please check all required fields.';
      }
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center ${textColor}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p>{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center ${textColor}`}>
          <p className="text-red-500">{error || 'Failed to load dashboard'}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-opacity-90"
          >
            {t('common.retry') || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: t('guide.totalTours'),
      value: dashboardData.totalTours,
      icon: FaMapMarkedAlt,
      trend: 12,
      bgColor: 'from-blue-500 to-blue-600',
    },
    {
      title: t('guide.activeTours'),
      value: dashboardData.activeTours,
      icon: FaCalendarCheck,
      trend: 5,
      bgColor: 'from-green-500 to-green-600',
    },
    {
      title: t('guide.totalBookings'),
      value: dashboardData.totalBookings,
      icon: FaCalendarCheck,
      trend: 18,
      bgColor: 'from-purple-500 to-purple-600',
    },
    {
      title: t('guide.totalEarnings'),
      value: `${dashboardData.totalEarnings.toLocaleString()}`,
      icon: FaMoneyBillWave,
      unit: 'EGP',
      trend: 25,
      bgColor: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add Tour Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${textColor} mb-2`}>
            {t('guide.myOverview')}
          </h2>
        </div>
        <button
          onClick={() => setShowAddTourModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D5B36A] text-black rounded-lg 
                   hover:bg-[#E2C784] transition-all font-medium shadow-lg"
        >
          <FaPlus />
          {t('guide.tours.add') || 'Add Tour'}
        </button>
      </div>

      {/* Stats Overview */}
      <div>
        <StatsOverview stats={stats} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="line"
          title={t('guide.bookingsTrend')}
          data={dashboardData.bookingTrend}
          dataKey="bookings"
          colors={['#7C3AED', '#C7A15C']}
        />
        <ChartComponent
          type="line"
          title={t('guide.earningsTrend')}
          data={dashboardData.earningsTrend}
          dataKey="earnings"
          colors={['#10B981', '#D5B36A']}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="bar"
          title={t('guide.tourPerformance')}
          data={dashboardData.tourPerformance}
          dataKey="bookings"
          colors={['#F59E0B', '#D5B36A']}
        />
        <ChartComponent
          type="pie"
          title={t('guide.analytics.tourPerformance')}
          data={dashboardData.tourPerformance}
          dataKey="value"
          colors={['#D5B36A', '#C7A15C', '#E2C784', '#B8860B', '#DAA520']}
        />
      </div>

      {/* My Tours Section */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t('guide.myTours') || 'My Tours'}
        </h3>
        {loadingTours ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D5B36A]"></div>
          </div>
        ) : myTours.length === 0 ? (
          <p className={`${secondaryText} text-center py-8`}>
            {t('guide.noTours') || 'No tours created yet. Create your first tour!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTours.map((tour) => (
              <div 
                key={tour._id}
                className={`${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} rounded-lg border ${borderColor} p-4 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className={`font-semibold ${textColor} truncate`}>{tour.name}</h4>
                    <p className={`text-xs ${secondaryText}`}>₹ {tour.price?.toLocaleString()}</p>
                  </div>
                  <FaBoxOpen className="text-[#D5B36A]" />
                </div>
                <p className={`text-sm ${secondaryText} line-clamp-2 mb-4`}>
                  {tour.description}
                </p>
                <button
                  onClick={() => navigate(`/guide/tour/${tour._id}/add-item`)}
                  className="w-full px-3 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] 
                           transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  <FaPlus className="text-sm" />
                  Add Item
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings Table */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t('guide.recentBookings')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th className={`text-left py-3 px-4 font-semibold ${secondaryText}`}>
                  Tour Name
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${secondaryText}`}>
                  Guest Name
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${secondaryText}`}>
                  Date
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${secondaryText}`}>
                  Amount
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${secondaryText}`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBookings.map((item) => (
                <tr key={item.id} className={`border-b ${borderColor} hover:${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} transition-colors`}>
                  <td className={`py-3 px-4 ${textColor}`}>{item.tourName}</td>
                  <td className={`py-3 px-4 ${textColor}`}>{item.guestName}</td>
                  <td className={`py-3 px-4 ${secondaryText}`}>{item.date}</td>
                  <td className={`py-3 px-4 ${textColor}`}>{item.amount} EGP</td>
                  <td className={`py-3 px-4`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tour Modal */}
      {showAddTourModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`${cardBg} rounded-xl border ${borderColor} p-6 max-w-md w-full`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textColor}`}>
                {t('guide.tours.addNew') || 'Add New Tour'}
              </h3>
              <button
                onClick={() => setShowAddTourModal(false)}
                className="p-2 hover:bg-[#D5B36A]/20 rounded-lg transition"
              >
                <FaTimes className={textColor} />
              </button>
            </div>

            <form onSubmit={handleAddTourSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                  {t('guide.tours.name') || 'Tour Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={newTourForm.name}
                  onChange={handleAddTourChange}
                  placeholder="Enter tour name"
                  required
                  maxLength={100}
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
                <span className={`text-xs ${secondaryText}`}>{newTourForm.name.length}/100 characters</span>
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                  {t('guide.tours.description') || 'Description'}
                </label>
                <textarea
                  name="description"
                  value={newTourForm.description}
                  onChange={handleAddTourChange}
                  placeholder="Enter tour description (min 10 characters)"
                  required
                  rows="3"
                  maxLength={2000}
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
                <span className={`text-xs ${secondaryText}`}>{newTourForm.description.length}/2000 characters (min 10)</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                    {t('guide.tours.price') || 'Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newTourForm.price}
                    onChange={handleAddTourChange}
                    placeholder="0.99"
                    step="0.01"
                    min="0.99"
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                              ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} 
                              ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                    {t('guide.tours.place') || 'Place/Location'}
                  </label>
                  <select
                    name="place"
                    value={newTourForm.place}
                    onChange={handleAddTourChange}
                    required
                    disabled={loadingPlaces || places.length === 0}
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                              ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} 
                              ${textColor} focus:outline-none focus:border-[#D5B36A]
                              ${loadingPlaces || places.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">{loadingPlaces ? 'Loading places...' : 'Select a place'}</option>
                    {places.map((place) => (
                      <option key={place._id} value={place._id}>
                        {place.name} ({place.city}, {place.country})
                      </option>
                    ))}
                  </select>
                  {places.length === 0 && !loadingPlaces && (
                    <p className={`text-xs ${secondaryText} mt-1`}>
                      {t('guide.tours.noPlacesAvailable') || 'No places available. Contact admin to add places.'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                  {t('guide.tours.categories') || 'Categories (comma-separated)'}
                </label>
                <input
                  type="text"
                  name="categories"
                  value={newTourForm.categories}
                  onChange={handleAddTourChange}
                  placeholder="e.g., Adventure, Cultural, Historical"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                  {t('guide.tours.tags') || 'Tags (comma-separated)'}
                </label>
                <input
                  type="text"
                  name="tags"
                  value={newTourForm.tags}
                  onChange={handleAddTourChange}
                  placeholder="e.g., outdoor, guided, family-friendly"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${secondaryText} mb-2`}>
                  {t('guide.tours.languages') || 'Languages (comma-separated)'}
                </label>
                <input
                  type="text"
                  name="languages"
                  value={newTourForm.languages}
                  onChange={handleAddTourChange}
                  placeholder="e.g., English, Arabic, French"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTourModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} 
                            ${textColor} hover:bg-[#D5B36A]/10 transition-all font-medium`}
                >
                  {t('admin.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg 
                           hover:bg-[#E2C784] transition-all font-medium"
                >
                  {t('admin.tours.create') || 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;
