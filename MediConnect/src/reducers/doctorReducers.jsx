import {
  DESIGNATION_LIST_REQUEST,
  DESIGNATION_LIST_SUCCESS,
  DESIGNATION_LIST_FAIL,
  SPECIALIZATION_LIST_REQUEST,
  SPECIALIZATION_LIST_SUCCESS,
  SPECIALIZATION_LIST_FAIL,
  DOCTOR_LIST_REQUEST,
  DOCTOR_LIST_SUCCESS,
  DOCTOR_LIST_FAIL,
  DOCTOR_PROFILE_REQUEST,
  DOCTOR_PROFILE_SUCCESS,
  DOCTOR_PROFILE_FAIL,
  DOCTOR_PROFILE_UPDATE_REQUEST,
  DOCTOR_PROFILE_UPDATE_SUCCESS,
  DOCTOR_PROFILE_UPDATE_FAIL,
  DOCTOR_DETAILS_REQUEST,
  DOCTOR_DETAILS_SUCCESS,
  DOCTOR_DETAILS_FAIL,
} from "../constants/doctorConstants";

// Designation Reducer
export const designationListReducer = (
  state = { designations: [] },
  action
) => {
  switch (action.type) {
    case DESIGNATION_LIST_REQUEST:
      return { loading: true, designations: [] };
    case DESIGNATION_LIST_SUCCESS:
      return { loading: false, designations: action.payload };
    case DESIGNATION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Specialization Reducer
export const specializationListReducer = (
  state = { specializations: [] },
  action
) => {
  switch (action.type) {
    case SPECIALIZATION_LIST_REQUEST:
      return { loading: true, specializations: [] };
    case SPECIALIZATION_LIST_SUCCESS:
      return { loading: false, specializations: action.payload };
    case SPECIALIZATION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Doctor Reducer
export const doctorListReducer = (state = { doctors: [] }, action) => {
  switch (action.type) {
    case DOCTOR_LIST_REQUEST:
      return { loading: true, doctors: [] };
    case DOCTOR_LIST_SUCCESS:
      return { loading: false, doctors: action.payload };
    case DOCTOR_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorProfileReducer = (state = { doctor: {} }, action) => {
  switch (action.type) {
    case DOCTOR_PROFILE_REQUEST:
      return { loading: true, ...state };
    case DOCTOR_PROFILE_SUCCESS:
      return { loading: false, doctor: action.payload };
    case DOCTOR_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorProfileUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCTOR_PROFILE_UPDATE_REQUEST:
      return { loading: true };
    case DOCTOR_PROFILE_UPDATE_SUCCESS:
      return { loading: false, success: true, doctor: action.payload };
    case DOCTOR_PROFILE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const doctorDetailsReducer = (state = { doctor: {} }, action) => {
  switch (action.type) {
    case DOCTOR_DETAILS_REQUEST:
      return { loading: true, ...state };
    case DOCTOR_DETAILS_SUCCESS:
      return { loading: false, doctor: action.payload };
    case DOCTOR_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
