import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "./../components/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/common/LoadingScreen";

export default function MainLayout() {

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      {showLoader && <LoadingScreen fullPage />}

      <Navbar />

      <main className="flex-1 pt-(--navbar-height)">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        <Footer />
      </main>
    </div>
  );
}
