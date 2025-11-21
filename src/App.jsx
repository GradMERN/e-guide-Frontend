// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Public Pages
import Home from './pages/shared/Home';
import TourPackages from './pages/shared/TourPackages';
import TourDetail from './pages/shared/TourDetail';
import About from './pages/shared/About';
import Contact from './pages/shared/Contact';
import Profile from './pages/shared/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminTours from './pages/admin/Tours';
import AdminUsers from './pages/admin/Users';
import AdminGuides from './pages/admin/Guides';

// Not Found
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<TourPackages />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Routes (No Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin Routes with Admin Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin', 'guide']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tours" element={<AdminTours />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="guides" element={<AdminGuides />} />
        <Route path="settings" element={<div className="text-white">Settings Page - Coming Soon</div>} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;