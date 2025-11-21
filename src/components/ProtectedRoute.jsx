
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0E0C]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D5B36A] mb-4"></div>
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0E0C] px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#D5B36A] mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black font-semibold rounded-lg hover:from-[#B8924F] hover:to-[#DCC07C] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;