import axios from "axios";
import {
  PATIENT_PROFILE_REQUEST,
  PATIENT_PROFILE_SUCCESS,
  PATIENT_PROFILE_FAIL,
  PATIENT_UPDATE_PROFILE_REQUEST,
  PATIENT_UPDATE_PROFILE_SUCCESS,
  PATIENT_UPDATE_PROFILE_FAIL,
} from "../constants/patientConstants";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Get Patient Profile
export const getPatientProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_PROFILE_REQUEST });

    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    const { data } = await axios.get(
      `${BASE_URL}/api/patient/profile/`,
      config
    );

    dispatch({ type: PATIENT_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PATIENT_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Update Patient Profile
export const updatePatientProfile =
  (profileData) => async (dispatch, getState) => {
    try {
      dispatch({ type: PATIENT_UPDATE_PROFILE_REQUEST });

      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token.access}`,
        },
      };

      const { data } = await axios.patch(
        `${BASE_URL}/api/patient/profile/`,
        profileData,
        config
      );

      dispatch({ type: PATIENT_UPDATE_PROFILE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PATIENT_UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
