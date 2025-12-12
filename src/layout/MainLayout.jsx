import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "./../components/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import ErrorBoundary from "../components/common/ErrorBoundary";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        <Footer />
      </main>
    </div>
  );
}
