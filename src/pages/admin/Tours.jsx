import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    price: '',
    currency: 'EGP',
    duration: '',
    maxGroupSize: 10
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tours?limit=100');
      setTours(response.data.data || []);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTour = () => {
    setEditingTour(null);
    setFormData({
      name: '',
      description: '',
      city: '',
      price: '',
      currency: 'EGP',
      duration: '',
      maxGroupSize: 10
    });
    setShowModal(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name,
      description: tour.description || '',
      city: tour.city || '',
      price: tour.price,
      currency: tour.currency || 'EGP',
      duration: tour.duration || '',
      maxGroupSize: tour.maxGroupSize || 10
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTour) {
        await api.patch(`/tours/${editingTour._id}`, formData);
        setTours(tours.map(t => t._id === editingTour._id ? { ...editingTour, ...formData } : t));
      } else {
        const response = await api.post('/tours', formData);
        setTours([...tours, response.data.data]);
      }
      setShowModal(false);
      setEditingTour(null);
    } catch (err) {
      console.error('Error saving tour:', err);
      setError(err.response?.data?.message || 'Failed to save tour');
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await api.delete(`/tours/${id}`);
        setTours(tours.filter(t => t._id !== id));
      } catch (err) {
        console.error('Error deleting tour:', err);
        setError(err.response?.data?.message || 'Failed to delete tour');
      }
    }
  };

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p className="text-white">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Tours</h1>
        <button
          onClick={handleAddTour}
          className="flex items-center gap-2 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
        >
          <FaPlus /> Add Tour
        </button>
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
          placeholder="Search tours by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
        />
      </div>

      {/* Tours Table */}
      <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D5B36A]/20 bg-[#2c1b0f]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Duration</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Group Size</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <tr key={tour._id} className="border-b border-[#D5B36A]/10 hover:bg-[#2c1b0f]/50 transition-all">
                    <td className="px-6 py-3 text-white font-medium">{tour.name}</td>
                    <td className="px-6 py-3 text-gray-300">{tour.city}</td>
                    <td className="px-6 py-3 text-[#D5B36A] font-semibold">{tour.price} {tour.currency}</td>
                    <td className="px-6 py-3 text-gray-300">{tour.duration}h</td>
                    <td className="px-6 py-3 text-gray-300">{tour.maxGroupSize}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
                        ★ {tour.ratingsAverage}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTour(tour)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    {searchTerm ? 'No tours found matching your search' : 'No tours yet'}
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
          <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingTour ? 'Edit Tour' : 'Add New Tour'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tour Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
                  >
                    <option>EGP</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Group Size</label>
                  <input
                    type="number"
                    value={formData.maxGroupSize}
                    onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F0E0C] text-white border border-[#D5B36A]/20 rounded-lg focus:outline-none focus:border-[#D5B36A]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
                >
                  {editingTour ? 'Update Tour' : 'Create Tour'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
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
