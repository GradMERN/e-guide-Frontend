import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth as useReduxAuth } from '../../store/hooks';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * ProtectedRoute wraps routes that require authentication and optional role checks.
 * Props:
 * - allowedRoles: array of roles (lowercase) allowed to access, e.g. ['admin']
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, isLoading, user } = useReduxAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const role = (user.role || '').toLowerCase();
    if (!allowedRoles.map(r => r.toLowerCase()).includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
