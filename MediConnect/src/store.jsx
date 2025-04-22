import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

// Import your reducers
import {
  userRegisterReducer,
  userActivationReducer,
  authReducer,
} from "./reducers/authReducers";

import {
  designationListReducer,
  specializationListReducer,
  doctorListReducer,
  doctorProfileReducer,
  doctorProfileUpdateReducer,
  doctorDetailsReducer,
} from "./reducers/doctorReducers";
import {
  patientProfileReducer,
  patientUpdateProfileReducer,
} from "./reducers/patientReducers";
import {
  availableTimeListReducer,
  availableTimeCreateReducer,
  availableTimeUpdateReducer,
  availableTimeDeleteReducer,
} from "./reducers/availableTimeReducer";

// Get userInfo from localStorage
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Combine all reducers
const rootReducer = combineReducers({
  userRegister: userRegisterReducer,
  userActivation: userActivationReducer,
  auth: authReducer, // Make sure this is 'auth'
  designationList: designationListReducer,
  specializationList: specializationListReducer,
  doctorList: doctorListReducer,
  doctorProfile: doctorProfileReducer,
  doctorProfileUpdate: doctorProfileUpdateReducer,
  patientProfile: patientProfileReducer,
  patientUpdateProfile: patientUpdateProfileReducer,
  availableTimeList: availableTimeListReducer,
  availableTimeCreate: availableTimeCreateReducer,
  availableTimeUpdate: availableTimeUpdateReducer,
  availableTimeDelete: availableTimeDeleteReducer,
  doctorDetails: doctorDetailsReducer,
});

// Preloaded state with userInfo
const preloadedState = {
  auth: { userInfo: userInfoFromStorage }, // This matches the key in authReducer
};

// Create store with preloaded state
export const store = configureStore({
  reducer: rootReducer,
  preloadedState, // ✅ Use preloadedState here
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
