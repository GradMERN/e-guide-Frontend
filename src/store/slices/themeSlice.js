import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: true,
  language: "en",
};

// Initialize theme from localStorage
try {
  const storedTheme = localStorage.getItem("theme") || "dark";
  initialState.isDarkMode = storedTheme === "dark";
  const storedLanguage = localStorage.getItem("language") || "en";
  initialState.language = storedLanguage;
} catch (error) {
  console.error("Error loading theme from localStorage:", error);
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode;
      try {
        localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
        // Apply theme to document
        if (state.isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {
        console.warn("Failed to persist theme to localStorage", e);
      }
    },
    setTheme(state, action) {
      state.isDarkMode = action.payload;
      try {
        localStorage.setItem("theme", action.payload ? "dark" : "light");
        // Apply theme to document
        if (action.payload) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {
        console.warn("Failed to persist theme to localStorage", e);
      }
    },
    setLanguage(state, action) {
      state.language = action.payload;
      try {
        localStorage.setItem("language", action.payload);
      } catch (e) {
        console.warn("Failed to persist language to localStorage", e);
      }
    },
  },
});

export const { toggleTheme, setTheme, setLanguage } = themeSlice.actions;

export const selectIsDarkMode = (state) => state.theme.isDarkMode;
export const selectLanguage = (state) => state.theme.language;

export default themeSlice.reducer;
