import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return getDefaultState();
    }

    if (userData === "undefined" || userData === "null") {
      console.warn("Invalid user data found in localStorage, clearing...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return getDefaultState();
    }

    const user = JSON.parse(userData);

    // Validate parsed data
    if (user && typeof user === "object" && token) {
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    } else {
      // Data is invalid, clear it
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return getDefaultState();
    }
  } catch (error) {
    console.error("Error loading auth from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return getDefaultState();
  }
};

// Default initial state
const getDefaultState = () => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout, clearError } =
  authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;
