import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tourReducer from "./slices/tourSlice";
import savedReducer from "./slices/savedSlice"; 
import uiReducer from "./slices/uiSlice";
import themeReducer from "./slices/themeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  tours: tourReducer,
  saved: savedReducer, 
  ui: uiReducer,
  theme: themeReducer,
});

export default rootReducer;
