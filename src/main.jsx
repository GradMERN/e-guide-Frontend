import { AuthProvider } from "./context/AuthContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import i18n from "./i18n";

// Ensure document direction (rtl/ltr) follows current language globally
const setDocDirection = (lng) => {
  try {
    const direction = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = lng;
  } catch (e) {
    // ignore during SSR or tests
  }
};

setDocDirection(i18n.language || 'en');
i18n.on('languageChanged', setDocDirection);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
