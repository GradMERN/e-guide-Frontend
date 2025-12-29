import { Navigate, Outlet } from 'react-router-dom';
import { useAuth as useReduxAuth } from '../../store/hooks';
import LoadingScreen from "../common/LoadingScreen";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, isLoading, user } = useReduxAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <LoadingScreen />
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
