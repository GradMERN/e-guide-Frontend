import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component - automatically scrolls to top when route changes
 * Place this component inside your Router component
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "smooth" for animated scroll
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
