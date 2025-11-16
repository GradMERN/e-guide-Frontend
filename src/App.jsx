import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminPage from "./pages/AdminPage";
import GuidePage from "./pages/GuidePage";
import TouristPage from "./pages/TouristPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // determine redirect path by role
  const redirectPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "guide"
      ? "/guide"
      : user?.role === "tourist"
      ? "/tourist"
      : "/login";

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={redirectPath} replace />
            )
          }
        />

        <Route path="/unauthorized" element={<h2>Unauthorized Access 🚫</h2>} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Guide routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "guide"]} />}>
          <Route path="/guide" element={<GuidePage />} />
        </Route>

        {/* Tourist routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "tourist"]} />}>
          <Route path="/tourist" element={<TouristPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
