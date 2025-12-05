import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tourReducer from "./slices/tourSlice"; // Import tour reducer

const rootReducer = combineReducers({
  auth: authReducer,
  tours: tourReducer, // Add tour reducer here
  // Add more reducers here as needed
});

export default rootReducer;
