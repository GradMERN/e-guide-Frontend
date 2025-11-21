import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0F0E0C] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
        
        <div className="bg-[#1B1A17] rounded-xl p-8 border border-[#D5B36A]/20">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#D5B36A]/20">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-4xl">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-[#D5B36A] font-medium capitalize">
                {user?.role} Account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-[#2c1b0f] rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-[#D5B36A]/20 flex items-center justify-center">
                <FaEnvelope className="text-[#D5B36A] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#2c1b0f] rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-[#D5B36A]/20 flex items-center justify-center">
                <FaPhone className="text-[#D5B36A] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-white font-medium">{user?.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#2c1b0f] rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-[#D5B36A]/20 flex items-center justify-center">
                <FaMapMarkerAlt className="text-[#D5B36A] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white font-medium">{user?.city}, {user?.country}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#2c1b0f] rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-[#D5B36A]/20 flex items-center justify-center">
                <FaCalendar className="text-[#D5B36A] text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-white font-medium">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#D5B36A]/20">
            <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div>
                <p className="text-gray-500 text-sm mb-1">Age</p>
                <p className="text-white">{user?.age} years old</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Role</p>
                <p className="text-white capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Email Verified</p>
                <p className={user?.isEmailVerified ? 'text-green-500' : 'text-red-500'}>
                  {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Last Login</p>
                <p className="text-white">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;