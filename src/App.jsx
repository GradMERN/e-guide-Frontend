import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./layout/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/shared/Home";
import Profile from "./pages/shared/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GuideDashboardLayout from "./layout/GuideDashboardLayout";
import GuideDashboard from "./pages/guide/Dashboard";
import ManageTours from "./pages/guide/ManageTours";
import Analytics from "./pages/guide/Analytics";
import GuidSettings from "./pages/guide/Settings";
import AddTourItem from "./pages/guide/AddTourItem";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTours from "./pages/admin/AdminTours";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminSettings from "./pages/admin/AdminSettings";
import Cart from "./pages/tourist/Cart";
import MyTours from "./pages/tourist/MyTours";
import About from "./pages/shared/About";
import NotFound from "./pages/NotFound";
import TourPackages from "./pages/shared/TourPackages";
import TourDetail from "./pages/shared/TourDetail";
import TourGuideProfile from "./components/tourGuides/TourGuideProfile";
import ProfileLayout from "./pages/profile/profileLayout";
import Overview from "./pages/profile/Overview";
import Info from "./pages/profile/info";
import Preferences from "./pages/profile/Preferences";
import Security from "./pages/profile/Security";
import AllDestinationPage from "./pages/shared/AllDestinationPage";
import DestinationDetail from "./components/allDestinations/DestinationDetail";
import SavedTours from "./pages/shared/SavedTours";
import PaymentRedirect from "./pages/payment/PaymentRedirect";
import PaymentSuccess from "./pages/payment/PaymentSuccess";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/payment-redirect", element: <PaymentRedirect /> },
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/tours", element: <TourPackages /> },
      { path: "/tours/:id", element: <TourDetail /> },
      { path: "/TourGuideProfile/:name", element: <TourGuideProfile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/my-tours", element: <MyTours /> },
      { path: "/saved", element: <SavedTours /> },
      { path: "/about", element: <About /> },
      { path: "/destinations", element: <AllDestinationPage /> },
      { path: "/destinations/:id", element: <DestinationDetail /> },
    ],
  },
  {
    element: <ProfileLayout />,
    children: [
      { path: "/profile/", element: <Overview /> },
      { path: "/profile/overview", element: <Overview /> },
      { path: "/profile/info", element: <Info /> },
      { path: "/profile/preferences", element: <Preferences /> },
      { path: "/profile/security", element: <Security /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // Guide Dashboard Routes
  {
    element: <GuideDashboardLayout />,
    children: [
      { path: "/guide/dashboard", element: <GuideDashboard /> },
      { path: "/guide/tours", element: <ManageTours /> },
      { path: "/guide/analytics", element: <Analytics /> },
      { path: "/guide/settings", element: <GuidSettings /> },
      { path: "/guide/tour/:tourId/add-item", element: <AddTourItem /> },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/tours", element: <AdminTours /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/guides", element: <AdminGuides /> },
      { path: "/admin/settings", element: <AdminSettings /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
