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
import {
  fetchTours,
  fetchTourById,
  clearTourError,
  selectTours,
  selectCurrentTour,
  selectToursLoading,
  selectToursError,
} from "./slices/tourSlice";

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
    }, [dispatch]),

    clearError: useCallback(() => {
      dispatch(clearError());
    }, [dispatch]),
  };
};

// Custom hook for tours
export const useTours = () => {
  const dispatch = useDispatch();

  return {
    // State
    tours: useSelector(selectTours),
    currentTour: useSelector(selectCurrentTour),
    loading: useSelector(selectToursLoading),
    error: useSelector(selectToursError),

    // Actions
    fetchTours: useCallback(
      (params) => {
        dispatch(fetchTours(params));
      },
      [dispatch]
    ),

    fetchTourById: useCallback(
      (id) => {
        dispatch(fetchTourById(id));
      },
      [dispatch]
    ),

    clearTourError: useCallback(() => {
      dispatch(clearTourError());
    }, [dispatch]),
  };
};

// Typed hooks for general use
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
