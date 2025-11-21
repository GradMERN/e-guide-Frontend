
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaMapMarkedAlt,
  FaUsers,
  FaUserTie,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEye,
  FaBell
} from 'react-icons/fa';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
    { name: 'Tours', path: '/admin/tours', icon: FaMapMarkedAlt },
    { name: 'Users', path: '/admin/users', icon: FaUsers },
    { name: 'Guides', path: '/admin/guides', icon: FaUserTie },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E0C] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#1B1A17] border-r border-[#D5B36A]/20 transition-all duration-300 flex flex-col fixed h-screen z-40`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#D5B36A]/20">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center">
                <FaEye className="text-black text-xl" />
              </div>
              <span className="text-[#D5B36A] font-semibold">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#D5B36A] hover:text-[#E2C784] p-2 hover:bg-[#2c1b0f] rounded-lg transition-all"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black shadow-lg'
                    : 'text-gray-400 hover:text-[#D5B36A] hover:bg-[#2c1b0f]'
                }`
              }
            >
              <item.icon className="text-xl flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-[#D5B36A]/20 p-4">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold flex-shrink-0">
                  {user?.firstName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-[#1B1A17] border-b border-[#D5B36A]/20 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-sm text-gray-400">Manage your Egypt tours platform</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-[#D5B36A] p-2 hover:bg-[#2c1b0f] rounded-lg transition-all">
              <FaBell className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2c1b0f] rounded-lg hover:bg-[#3c2b1f] transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm">
                  {user?.firstName?.charAt(0)}
                </div>
                <span className="text-white text-sm font-medium hidden md:block">
                  {user?.firstName}
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1B1A17] rounded-lg shadow-xl border border-[#D5B36A]/20 py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#2c1b0f] transition-all"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate('/');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#2c1b0f] transition-all"
                  >
                    View Website
                  </button>
                  <hr className="my-2 border-[#D5B36A]/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0F0E0C] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;