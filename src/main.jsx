import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
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

// Defensive: suppress known cleanup errors from 3rd party libs (motion, ogl, etc.)
const originalError = console.error;
console.error = (...args) => {
  const msg = args[0]?.toString?.() || "";
  // Suppress "destroy is not a function" errors from library cleanup
  if (
    msg.includes("destroy is not a function") ||
    (msg.includes("is not a function") && msg.includes("destroy"))
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Handle unhandled promise rejections gracefully
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason?.message || event.reason?.toString?.() || "";
  if (reason.includes("destroy is not a function")) {
    try {
      // Instrument: log full details using originalError so suppression doesn't hide it
      originalError(
        "[INSTRUMENTATION] unhandledrejection: destroy error detected",
        {
          reason: event.reason,
          location: window.location.href,
          userAgent: navigator.userAgent,
        }
      );
    } catch (e) {}
    event.preventDefault();
    return;
  }
});

// Instrument global errors to capture stacks for cleanup issues
window.addEventListener("error", (ev) => {
  try {
    const msg = ev.error?.message || ev.message || "";
    if (msg && msg.includes("destroy is not a function")) {
      originalError("[INSTRUMENTATION] window.error captured:", {
        message: msg,
        error: ev.error,
        filename: ev.filename,
        lineno: ev.lineno,
        colno: ev.colno,
        location: window.location.href,
        userAgent: navigator.userAgent,
      });
    }
  } catch (e) {}
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
