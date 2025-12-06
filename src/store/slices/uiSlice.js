import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    navbarVisible: true,
    navbarHeight: 80, // default
  },
  reducers: {
    setNavbarVisible: (state, action) => {
      state.navbarVisible = action.payload;
    },
    setNavbarHeight: (state, action) => {
      state.navbarHeight = action.payload;
    },
  },
});

export const { setNavbarVisible, setNavbarHeight } = uiSlice.actions;
export default uiSlice.reducer;
