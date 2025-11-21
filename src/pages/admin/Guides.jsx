import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaPhone, FaStar } from 'react-icons/fa';
import api from '../../services/api';

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [guideTours, setGuideTours] = useState({});

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin');
      const guidesList = response.data.data.filter(user => user.role === 'guide');
      setGuides(guidesList);

      // Fetch tours for each guide
      for (const guide of guidesList) {
        try {
          const toursResponse = await api.get(`/tours/guide/${guide._id}`);
          setGuideTours(prev => ({
            ...prev,
            [guide._id]: toursResponse.data.data || []
          }));
        } catch (err) {
          console.error(`Error fetching tours for guide ${guide._id}:`, err);
        }
      }
    } catch (err) {
      console.error('Error fetching guides:', err);
      setError('Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(guide =>
    guide.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p className="text-white">Loading guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Guides</h1>
        <p className="text-gray-400">Manage and monitor your tour guides</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search guides by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Guides</p>
          <p className="text-2xl font-bold text-green-500">{guides.length}</p>
        </div>
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Active Guides</p>
          <p className="text-2xl font-bold text-blue-500">
            {guides.filter(g => (guideTours[g._id] || []).length > 0).length}
          </p>
        </div>
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Tours</p>
          <p className="text-2xl font-bold text-amber-500">
            {Object.values(guideTours).reduce((sum, tours) => sum + tours.length, 0)}
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <div key={guide._id} className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6 hover:border-[#D5B36A]/50 transition-all">
              {/* Guide Avatar and Name */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-lg">
                    {guide.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{guide.firstName} {guide.lastName}</p>
                    <p className="text-xs text-gray-400">{guide.age} years old</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 pb-4 border-b border-[#D5B36A]/20">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaPhone className="text-[#D5B36A]" />
                  <span>{guide.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaMapMarkedAlt className="text-[#D5B36A]" />
                  <span>{guide.city}, {guide.country}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{guide.email}</p>
              </div>

              {/* Tours and Rating */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#2c1b0f] rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-[#D5B36A]">
                    {(guideTours[guide._id] || []).length}
                  </p>
                  <p className="text-xs text-gray-400">Tours</p>
                </div>
                <div className="bg-[#2c1b0f] rounded-lg p-3 text-center">
                  <p className="flex items-center justify-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="text-2xl font-bold text-white">4.5</span>
                  </p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
              </div>

              {/* Recent Tours */}
              {(guideTours[guide._id] || []).length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-2">Recent Tours:</p>
                  <div className="space-y-1">
                    {(guideTours[guide._id] || []).slice(0, 3).map((tour) => (
                      <p key={tour._id} className="text-xs text-gray-400 truncate">
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
            <p className="text-gray-400">
              {searchTerm ? 'No guides found' : 'No guides available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuides;
