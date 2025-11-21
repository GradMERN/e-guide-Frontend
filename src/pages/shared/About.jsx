import React from 'react';
import { FaEye, FaHeart, FaUsers, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-[#0F0E0C] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            About <span className="text-[#D5B36A]">Mystic Egypt Tours</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your gateway to the wonders of Ancient Egypt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#1B1A17] rounded-xl p-6 border border-[#D5B36A]/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-2xl text-black" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">10,000+</h3>
            <p className="text-gray-400">Happy Travelers</p>
          </div>
          <div className="bg-[#1B1A17] rounded-xl p-6 border border-[#D5B36A]/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaAward className="text-2xl text-black" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">50+</h3>
            <p className="text-gray-400">Expert Guides</p>
          </div>
          <div className="bg-[#1B1A17] rounded-xl p-6 border border-[#D5B36A]/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEye className="text-2xl text-black" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">100+</h3>
            <p className="text-gray-400">Tour Packages</p>
          </div>
          <div className="bg-[#1B1A17] rounded-xl p-6 border border-[#D5B36A]/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-2xl text-black" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">15+</h3>
            <p className="text-gray-400">Years Experience</p>
          </div>
        </div>

        <div className="bg-[#1B1A17] rounded-2xl p-12 border border-[#D5B36A]/20">
          <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Founded in 2010, Mystic Egypt Tours began with a simple mission: to share the incredible 
            history and culture of ancient Egypt with travelers from around the world.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Today, we continue to bring the mysteries of the pharaohs to life, one tour at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;