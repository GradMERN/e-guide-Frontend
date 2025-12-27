import { createSlice } from "@reduxjs/toolkit";

// Helper to load saved tours from localStorage
const loadSavedFromStorage = () => {
  try {
    const saved = localStorage.getItem("savedTours");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Helper to persist saved tours to localStorage
const persistToStorage = (tours) => {
  try {
    localStorage.setItem("savedTours", JSON.stringify(tours));
  } catch {
  }
};

const savedSlice = createSlice({
  name: "saved",
  initialState: {
    savedTours: loadSavedFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    addToSaved: (state, action) => {
      const tourId = action.payload._id || action.payload.id;
      const exists = state.savedTours.some((tour) => {
        const existingTourId = tour._id || tour.id;
        return existingTourId === tourId;
      });
      if (!exists) {
        state.savedTours.push(action.payload);
        persistToStorage(state.savedTours);
      }
    },
    removeFromSaved: (state, action) => {
      const tourId = action.payload;
      state.savedTours = state.savedTours.filter((tour) => {
        const existingTourId = tour._id || tour.id;
        return existingTourId !== tourId;
      });
      persistToStorage(state.savedTours);
    },
    clearSaved: (state) => {
      state.savedTours = [];
      persistToStorage([]);
    },
    setSavedTours: (state, action) => {
      state.savedTours = action.payload;
      persistToStorage(action.payload);
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
