import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/ToastTheme.css";
import DashboardLayout from "./layout/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/shared/Home";
import Profile from "./pages/shared/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GoogleRedirect from "./pages/auth/GoogleRedirect";
import OAuthSuccess from "./pages/auth/OAuthSuccess";
import GuideDashboardLayout from "./layout/GuideDashboardLayout";
import GuideDashboard from "./pages/guide/Dashboard";
import ManageTours from "./pages/guide/ManageTours";
import Analytics from "./pages/guide/Analytics";
import GuidSettings from "./pages/guide/Settings";
import GuideProfileSettings from "./pages/guide/GuideProfileSettings";
import AddTourItem from "./pages/guide/AddTourItem";
import TourItemsPage from "./pages/guide/TourItemsPage";
import GuideTourPreview from "./pages/guide/GuideTourPreview";
import BecomeGuidePage from "./pages/guide/BecomeGuidePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTours from "./pages/admin/AdminTours";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGuides from "./pages/admin/AdminGuides";
// import AdminSettings from "./pages/admin/AdminSettings"; // Commented out - page not ready
import AdminGuideApplications from "./components/admin/AdminGuideApplications";
import Cart from "./pages/tourist/Cart";
import MyTours from "./pages/tourist/MyTours";
import About from "./pages/shared/About";
import NotFound from "./pages/NotFound";
import TourPackages from "./pages/shared/TourPackages";
import TourDetail from "./pages/shared/TourDetail";
import TourPlay from "./pages/tourist/TourPlay";
import TourGuideProfile from "./components/tourGuides/TourGuideProfile";
import ProfileLayout from "./pages/profile/profileLayout";
import Overview from "./pages/profile/Overview";
import Info from "./pages/profile/info";
import Security from "./pages/profile/Security";
import AllDestinationPage from "./pages/shared/AllDestinationPage";
import DestinationDetail from "./components/allDestinations/DestinationDetail";
import SavedTours from "./pages/shared/SavedTours";
import PaymentRedirect from "./pages/payment/PaymentRedirect";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import ContactUs from "./pages/shared/ContactUs";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/payment-redirect", element: <PaymentRedirect /> },
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/tours", element: <TourPackages /> },
      { path: "/tours/:id", element: <TourDetail /> },
      { path: "/tour/play/:tourId", element: <TourPlay /> },
      { path: "/TourGuideProfile/:id", element: <TourGuideProfile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/my-tours", element: <MyTours /> },
      { path: "/saved", element: <SavedTours /> },
      { path: "/about", element: <About /> },
      { path: "/destinations", element: <AllDestinationPage /> },
      { path: "/destinations/:id", element: <DestinationDetail /> },
      { path: "contact", element: <ContactUs /> },
      { path: "/become-guide", element: <BecomeGuidePage /> },
    ],
  },
  {
    element: <ProfileLayout />,
    children: [
      { path: "/profile/", element: <Overview /> },
      { path: "/profile/overview", element: <Overview /> },
      { path: "/profile/info", element: <Info /> },
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
  { path: "/auth/google-redirect", element: <GoogleRedirect /> },
  { path: "/oauth-success", element: <OAuthSuccess /> },
  // Guide Dashboard Routes (protected)
  {
    element: (
      <ProtectedRoute allowedRoles={["guide"]}>
        <GuideDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/guide/dashboard", element: <GuideDashboard /> },
      { path: "/guide/tours", element: <ManageTours /> },
      { path: "/guide/tour/:tourId", element: <GuideTourPreview /> },
      { path: "/guide/tours/:tourId/items", element: <TourItemsPage /> },
      { path: "/guide/analytics", element: <Analytics /> },
      { path: "/guide/settings", element: <GuidSettings /> },
      { path: "/guide/profile", element: <GuideProfileSettings /> },
      { path: "/guide/tour/:tourId/add-item", element: <AddTourItem /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/tours", element: <AdminTours /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/guides", element: <AdminGuides /> },
      {
        path: "/admin/guide-applications",
        element: <AdminGuideApplications />,
      },
      // { path: "/admin/settings", element: <AdminSettings /> }, // Commented out - page not ready
      // Admin tour preview: reuse the same TourPreview used by guides
      { path: "/admin/tour/:tourId", element: <GuideTourPreview /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
