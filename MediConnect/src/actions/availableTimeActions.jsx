// src/actions/availableTimeActions.js
import axios from "axios";
import {
  AVAILABLE_TIME_LIST_REQUEST,
  AVAILABLE_TIME_LIST_SUCCESS,
  AVAILABLE_TIME_LIST_FAIL,
  AVAILABLE_TIME_CREATE_REQUEST,
  AVAILABLE_TIME_CREATE_SUCCESS,
  AVAILABLE_TIME_CREATE_FAIL,
  AVAILABLE_TIME_UPDATE_REQUEST,
  AVAILABLE_TIME_UPDATE_SUCCESS,
  AVAILABLE_TIME_UPDATE_FAIL,
  AVAILABLE_TIME_DELETE_REQUEST,
  AVAILABLE_TIME_DELETE_SUCCESS,
  AVAILABLE_TIME_DELETE_FAIL,
} from "../constants/availableTimeConstants";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// List Available Times
export const listAvailableTimes = () => async (dispatch, getState) => {
  try {
    dispatch({ type: AVAILABLE_TIME_LIST_REQUEST });

    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    const { data } = await axios.get(
      `${BASE_URL}/api/doctors/me/available-times/list/`,
      config
    );

    dispatch({ type: AVAILABLE_TIME_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: AVAILABLE_TIME_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Create Available Time
export const createAvailableTime = (timeData) => async (dispatch, getState) => {
  try {
    dispatch({ type: AVAILABLE_TIME_CREATE_REQUEST });

    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    const { data } = await axios.post(
      `${BASE_URL}/api/doctors/me/available-times/`,
      timeData,
      config
    );

    dispatch({ type: AVAILABLE_TIME_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: AVAILABLE_TIME_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Update Available Time
export const updateAvailableTime =
  (id, timeData) => async (dispatch, getState) => {
    try {
      dispatch({ type: AVAILABLE_TIME_UPDATE_REQUEST });

      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token.access}`,
        },
      };

      const { data } = await axios.put(
        `${BASE_URL}/api/doctors/me/available-times/${id}/`,
        timeData,
        config
      );

      dispatch({ type: AVAILABLE_TIME_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: AVAILABLE_TIME_UPDATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// Delete Available Time
export const deleteAvailableTime = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: AVAILABLE_TIME_DELETE_REQUEST });

    const {
      auth: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    await axios.delete(
      `${BASE_URL}/api/doctors/me/available-times/${id}/`,
      config
    );

    dispatch({ type: AVAILABLE_TIME_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: AVAILABLE_TIME_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
