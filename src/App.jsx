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

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/tours", element: <TourPackages /> },
      { path: "/tours/:id", element: <TourDetail /> },
      { path: "/profile", element: <Profile /> },
      { path: "/TourGuideProfile/:name", element: <TourGuideProfile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/my-tours", element: <MyTours /> },
      { path: "/about", element: <About /> },
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
