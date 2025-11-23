import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/shared/Home";
import TourDesc from "./pages/shared/TourDesc";
import Profile from "./pages/shared/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Guide/Dashboard";
import Cart from "./pages/tourist/Cart";
import MyTours from "./pages/tourist/MyTours";
import About from "./pages/shared/About";
import NotFound from "./pages/NotFound";
import ProfileLayout from "./pages/profile/profileLayout";
import Address from "./pages/profile/Address";
import Info from "./pages/profile/Info";
import Overview from "./pages/profile/Overview";
import Preferences from "./pages/profile/Preferences";
import Security from "./pages/profile/Security";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/tours/:id", element: <TourDesc /> },
      { path: "/cart", element: <Cart /> },
      { path: "/my-tours", element: <MyTours /> },
      { path: "/about", element: <About /> },
    ],
  },
  {
    element: <ProfileLayout />,
    children: [
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
