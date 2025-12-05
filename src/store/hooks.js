import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  loginSuccess,
  logout,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
} from "./slices/authSlice";

// Custom hook for auth
export const useAuth = () => {
  const dispatch = useDispatch();

  return {
    // State
    user: useSelector(selectUser),
    isAuthenticated: useSelector(selectIsAuthenticated),
    isLoading: useSelector(selectIsLoading),
    error: useSelector(selectError),

    // Actions
    login: useCallback(
      (userData, token) => {
        dispatch(loginSuccess({ user: userData, token }));
      },
      [dispatch]
    ),

    logout: useCallback(() => {
      dispatch(logout());
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
      // Notify AuthContext and other parts of the app
      try {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      } catch (e) {}
    }, [dispatch]),

    clearError: useCallback(() => {
      dispatch(clearError());
    }, [dispatch]),
  };
};

// Typed hooks for general use
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
