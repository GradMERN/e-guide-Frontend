import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      const response = await tourService.getTourById(id);
      setTour(response.data);
    } catch (error) {
      setError('Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/tours/${id}` } });
      return;
    }
    alert('Booking functionality - Coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0E0C] pt-24">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D5B36A]"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0E0C] pt-24 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Tour Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-semibold rounded-lg"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0E0C] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#D5B36A] hover:text-[#E2C784] mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-[#1B1A17] rounded-2xl overflow-hidden border border-[#D5B36A]/20">
          <div className="h-96 bg-gradient-to-br from-[#2c1b0f] to-[#1B1A17] flex items-center justify-center">
            <div className="text-9xl text-[#D5B36A]/20">🏛️</div>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-[#D5B36A]/20 text-[#D5B36A] rounded-full text-sm">
                    Featured
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar />
                    <span className="text-white font-semibold">
                      {tour.ratingsAverage?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{tour.name}</h1>
                <p className="text-gray-400 text-lg">
                  {tour.description || 'Explore the wonders of ancient Egypt with expert guides.'}
                </p>
              </div>
              <div className="text-right ml-8">
                <p className="text-gray-400 text-sm mb-1">Starting from</p>
                <p className="text-4xl font-bold text-[#D5B36A]">
                  {tour.price} <span className="text-2xl">{tour.currency}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 bg-[#2c1b0f] rounded-xl">
              <div className="flex items-center gap-3">
                <FaClock className="text-[#D5B36A] text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white font-semibold">{tour.duration || 8} hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUsers className="text-[#D5B36A] text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Group Size</p>
                  <p className="text-white font-semibold">Max {tour.maxGroupSize || 10}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#D5B36A] text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-semibold">{tour.city || 'Cairo'}, Egypt</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D5B36A] text-2xl">🎫</span>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-green-500 font-semibold">Available</p>
                </div>
              </div>
            </div>

            {tour.guide && (
              <div className="mb-8 p-6 bg-[#2c1b0f] rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Your Guide</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-2xl">
                    {tour.guide.firstName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {tour.guide.firstName} {tour.guide.lastName}
                    </h4>
                    <p className="text-gray-400">Professional Egyptologist</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              className="w-full py-4 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-bold text-lg rounded-lg hover:from-[#B8924F] hover:to-[#DCC07C]"
            >
              Book This Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;