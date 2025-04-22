import axios from "axios";
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_ACTIVATION_SUCCESS,
  USER_ACTIVATION_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../constants/authConstants";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${BASE_URL}/api/user/register/`,
      userData,
      config
    );

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Activate User Action
export const activateUser = (uid, token) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/user/activate/${uid}/${token}/`
    );
    // ✅ Sending uid and token in the URL

    dispatch({ type: USER_ACTIVATION_SUCCESS, payload: data.msg });
    return data;
  } catch (error) {
    dispatch({
      type: USER_ACTIVATION_FAIL,
      payload: error.response?.data?.detail || "Activation failed.",
    });
    throw error.response?.data || { message: "Activation failed." };
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `${BASE_URL}/api/user/login/`,
      { email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // Save user data in local storage
    localStorage.setItem("userInfo", JSON.stringify(data));

    return data;
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.error || "Login failed.",
    });
  }
};

// Logout action
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("userInfo"); // Remove user info from local storage
  dispatch({ type: USER_LOGOUT });
};
