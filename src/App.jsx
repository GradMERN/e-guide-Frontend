import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/shared/Home";
import Profile from "./pages/shared/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Guide/GuideDashboard";
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

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/tours", element: <TourPackages /> },
      { path: "/tours/:id", element: <TourDetail /> },
      { path: "/TourGuideProfile/:name", element: <TourGuideProfile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/my-tours", element: <MyTours /> },
      { path: "/about", element: <About /> },
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
  {
    element: <DashboardLayout />,
    children: [{ path: "/dashboard", element: <Dashboard /> }],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
