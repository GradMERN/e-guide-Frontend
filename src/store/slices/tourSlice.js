import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tourApi from "../../apis/tour.api";

// Async thunks for GET operations only
export const fetchTours = createAsyncThunk(
  "tours/fetchTours",
  async (params = { isPublished: true }, { rejectWithValue }) => {
    try {
      const response = await tourApi.getAllTours(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tours"
      );
    }
  }
);

export const fetchTourById = createAsyncThunk(
  "tours/fetchTourById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await tourApi.getTourById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tour"
      );
    }
  }
);

const tourSlice = createSlice({
  name: "tours",
  initialState: {
    tours: [],
    currentTour: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTourError: (state) => {
      state.error = null;
    },
    clearCurrentTour: (state) => {
      state.currentTour = null;
    },
    resetTours: (state) => {
      state.tours = [];
      state.currentTour = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tours
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response formats
        if (Array.isArray(action.payload)) {
          state.tours = action.payload;
        } else if (action.payload.tours) {
          state.tours = action.payload.tours;
        } else if (action.payload.data) {
          state.tours = action.payload.data;
        } else {
          state.tours = action.payload;
        }
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single tour
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response formats
        if (action.payload.tour) {
          state.currentTour = action.payload.tour;
        } else if (action.payload.data) {
          state.currentTour = action.payload.data;
        } else {
          state.currentTour = action.payload;
        }
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors (to match your auth slice pattern)
export const selectTours = (state) => state.tours.tours;
export const selectCurrentTour = (state) => state.tours.currentTour;
export const selectToursLoading = (state) => state.tours.loading;
export const selectToursError = (state) => state.tours.error;

export const { clearTourError, clearCurrentTour, resetTours } =
  tourSlice.actions;

export default tourSlice.reducer;
