import { createSlice } from "@reduxjs/toolkit";

const getDefaultState = () => ({
  user: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    role: null,
    phone: null,
    country: null,
    city: null,
    avatar: null,
    lastLogin: null,
  },
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

const loadInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const defaultState = getDefaultState();

    if (!token || !userData) return defaultState;

    if (userData === "undefined" || userData === "null") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return defaultState;
    }

    const parsed = JSON.parse(userData);
    if (!parsed || typeof parsed !== "object") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return defaultState;
    }

    return {
      ...defaultState,
      user: parsed,
      token,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error loading auth from localStorage:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return getDefaultState();
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, { payload }) => {
      const { user, token } = payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      try {
        localStorage.setItem("token", token || "");
        localStorage.setItem("user", JSON.stringify(user || {}));
      } catch (e) {
        console.warn("Failed to persist auth to localStorage", e);
      }
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
      return getDefaultState();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
      try {
        localStorage.setItem("user", JSON.stringify(payload || {}));
      } catch (e) {
        console.warn("Failed to persist user to localStorage", e);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUser,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;
