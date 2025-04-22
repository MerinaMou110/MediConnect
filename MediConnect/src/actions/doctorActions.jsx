import axios from "axios";
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
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch Designations
export const listDesignations = () => async (dispatch) => {
  try {
    dispatch({ type: DESIGNATION_LIST_REQUEST });

    const { data } = await axios.get(`${BASE_URL}/api/doctors/designations/`);

    dispatch({
      type: DESIGNATION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DESIGNATION_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Fetch Specializations
export const listSpecializations = () => async (dispatch) => {
  try {
    dispatch({ type: SPECIALIZATION_LIST_REQUEST });

    const { data } = await axios.get(
      `${BASE_URL}/api/doctors/specializations/`
    );

    dispatch({
      type: SPECIALIZATION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SPECIALIZATION_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Fetch Doctors
// Fetch Doctors with Filters
// doctorActions.jsx

// Other imports...

export const listDoctors =
  (specializationSlug = "", designationSlug = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: DOCTOR_LIST_REQUEST });

      // Construct query string for filters
      const queryParams = new URLSearchParams();
      if (specializationSlug)
        queryParams.append("specialization", specializationSlug);
      if (designationSlug) queryParams.append("designation", designationSlug);

      const { data } = await axios.get(
        `${BASE_URL}/api/doctors/?${queryParams.toString()}`
      );

      dispatch({
        type: DOCTOR_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOCTOR_LIST_FAIL,
        payload: error.response?.data?.detail || error.message,
      });
    }
  };

export const getDoctorProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCTOR_PROFILE_REQUEST });

    const {
      auth: { userInfo },
    } = getState();

    // Check if userInfo and token are present
    if (!userInfo || !userInfo.token || !userInfo.token.access) {
      throw new Error("User not authenticated");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    const { data } = await axios.get(
      `${BASE_URL}/api/doctors/profile/`,
      config
    );

    dispatch({
      type: DOCTOR_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOCTOR_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateDoctorProfile =
  (profileData) => async (dispatch, getState) => {
    try {
      dispatch({ type: DOCTOR_PROFILE_UPDATE_REQUEST });

      const {
        auth: { userInfo },
      } = getState(); // ✅ Corrected here

      // Safely access the token
      if (!userInfo || !userInfo.token || !userInfo.token.access) {
        throw new Error("User not authenticated");
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token.access}`,
        },
      };

      const { data } = await axios.patch(
        `${BASE_URL}/api/doctors/profile/`,
        profileData,
        config
      );

      dispatch({
        type: DOCTOR_PROFILE_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOCTOR_PROFILE_UPDATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// Action to get details of a specific doctor
export const getDoctorDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: DOCTOR_DETAILS_REQUEST });

    const { data } = await axios.get(`${BASE_URL}/api/doctors/${id}/`);

    dispatch({
      type: DOCTOR_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOCTOR_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
