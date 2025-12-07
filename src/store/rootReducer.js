import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tourReducer from "./slices/tourSlice";
import savedReducer from "./slices/savedSlice"; // Add saved reducer
import uiReducer from "./slices/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  tours: tourReducer,
  saved: savedReducer, // Add saved reducer here
  ui: uiReducer,
});

export default rootReducer;
