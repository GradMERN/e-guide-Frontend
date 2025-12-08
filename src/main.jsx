import { AuthProvider } from "./context/AuthContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App.jsx";
import i18n from "./i18n";
import { store, persistor } from "./store";

// Ensure document direction (rtl/ltr) follows current language globally
const setDocDirection = (lng) => {
  try {
    const direction = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = lng;
  } catch (e) {
    // ignore during SSR or tests
  }
};

setDocDirection(i18n.language || "en");
i18n.on("languageChanged", setDocDirection);

// Defensive: hide known unwanted modal messages that interrupt flow

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
