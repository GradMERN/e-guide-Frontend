import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { FaMapMarkerAlt, FaClock, FaStar, FaSearch } from 'react-icons/fa';

const TourPackages = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await tourService.getAllTours();
      setTours(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours
    .filter(tour => {
      const matchesSearch = tour.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = priceRange === 'all' ||
        (priceRange === 'low' && tour.price < 1000) ||
        (priceRange === 'medium' && tour.price >= 1000 && tour.price <= 3000) ||
        (priceRange === 'high' && tour.price > 3000);
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0E0C]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D5B36A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0E0C] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Explore <span className="text-[#D5B36A]">Egypt</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Discover amazing tours and experiences across ancient Egypt
          </p>
        </div>

        <div className="bg-[#1B1A17] rounded-xl p-6 mb-8 border border-[#D5B36A]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#2c1b0f] border border-[#D5B36A]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
              />
            </div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 bg-[#2c1b0f] border border-[#D5B36A]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
            >
              <option value="all">All Prices</option>
              <option value="low">Under 1000 EGP</option>
              <option value="medium">1000 - 3000 EGP</option>
              <option value="high">Above 3000 EGP</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#2c1b0f] border border-[#D5B36A]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D5B36A]"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <Link
              key={tour._id}
              to={`/tours/${tour._id}`}
              className="group bg-[#1B1A17] rounded-xl overflow-hidden border border-[#D5B36A]/20 hover:border-[#D5B36A]/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#D5B36A]/20"
            >
              <div className="h-56 bg-gradient-to-br from-[#2c1b0f] to-[#1B1A17] flex items-center justify-center overflow-hidden">
                <div className="text-8xl text-[#D5B36A]/20 group-hover:scale-110 transition-transform">
                  🏛️
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-[#D5B36A]/20 text-[#D5B36A] rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <FaStar />
                    <span className="text-white font-semibold">
                      {tour.ratingsAverage?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D5B36A] transition-colors">
                  {tour.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaMapMarkerAlt className="text-[#D5B36A]" />
                    <span>{tour.city || 'Cairo'}, Egypt</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaClock className="text-[#D5B36A]" />
                    <span>{tour.duration || 8} hours</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#D5B36A]/20">
                  <div>
                    <span className="text-gray-400 text-sm">From</span>
                    <p className="text-2xl font-bold text-[#D5B36A]">
                      {tour.price} <span className="text-sm">{tour.currency}</span>
                    </p>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-semibold rounded-full hover:from-[#B8924F] hover:to-[#DCC07C] transition-all">
                    View
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No tours found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPackages;