import { createSlice } from "@reduxjs/toolkit";

const savedSlice = createSlice({
  name: "saved",
  initialState: {
    savedTours: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToSaved: (state, action) => {
      const tourId = action.payload._id || action.payload.id;
      // Check if tour already exists
      const exists = state.savedTours.some((tour) => {
        const existingTourId = tour._id || tour.id;
        return existingTourId === tourId;
      });
      if (!exists) {
        state.savedTours.push(action.payload);
      }
    },
    removeFromSaved: (state, action) => {
      const tourId = action.payload;
      state.savedTours = state.savedTours.filter((tour) => {
        const existingTourId = tour._id || tour.id;
        return existingTourId !== tourId;
      });
    },
    clearSaved: (state) => {
      state.savedTours = [];
    },
    setSavedTours: (state, action) => {
      state.savedTours = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Updated selector to handle both _id and id
export const selectSavedTours = (state) => state.saved.savedTours;
export const selectSavedLoading = (state) => state.saved.loading;
export const selectSavedError = (state) => state.saved.error;
export const selectIsTourSaved = (tourId) => (state) =>
  state.saved.savedTours.some((tour) => {
    const existingTourId = tour._id || tour.id;
    return existingTourId === tourId;
  });

// Actions
export const {
  addToSaved,
  removeFromSaved,
  clearSaved,
  setSavedTours,
  setLoading,
  setError,
  clearError,
} = savedSlice.actions;

export default savedSlice.reducer;
