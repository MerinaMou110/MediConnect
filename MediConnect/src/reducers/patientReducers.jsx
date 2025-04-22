import {
  PATIENT_PROFILE_REQUEST,
  PATIENT_PROFILE_SUCCESS,
  PATIENT_PROFILE_FAIL,
  PATIENT_UPDATE_PROFILE_REQUEST,
  PATIENT_UPDATE_PROFILE_SUCCESS,
  PATIENT_UPDATE_PROFILE_FAIL,
  PATIENT_UPDATE_PROFILE_RESET,
} from "../constants/patientConstants";

export const patientProfileReducer = (state = { patient: {} }, action) => {
  switch (action.type) {
    case PATIENT_PROFILE_REQUEST:
      return { loading: true, ...state };

    case PATIENT_PROFILE_SUCCESS:
      return { loading: false, patient: action.payload };

    case PATIENT_PROFILE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const patientUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case PATIENT_UPDATE_PROFILE_REQUEST:
      return { loading: true };

    case PATIENT_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, patient: action.payload };

    case PATIENT_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };

    case PATIENT_UPDATE_PROFILE_RESET:
      return {};

    default:
      return state;
  }
};
