// src/reducers/availableTimeReducer.js
import {
  AVAILABLE_TIME_LIST_REQUEST,
  AVAILABLE_TIME_LIST_SUCCESS,
  AVAILABLE_TIME_LIST_FAIL,
  AVAILABLE_TIME_CREATE_REQUEST,
  AVAILABLE_TIME_CREATE_SUCCESS,
  AVAILABLE_TIME_CREATE_FAIL,
  AVAILABLE_TIME_CREATE_RESET,
  AVAILABLE_TIME_UPDATE_REQUEST,
  AVAILABLE_TIME_UPDATE_SUCCESS,
  AVAILABLE_TIME_UPDATE_FAIL,
  AVAILABLE_TIME_UPDATE_RESET,
  AVAILABLE_TIME_DELETE_REQUEST,
  AVAILABLE_TIME_DELETE_SUCCESS,
  AVAILABLE_TIME_DELETE_FAIL,
} from "../constants/availableTimeConstants";

export const availableTimeListReducer = (
  state = { availableTimes: [] },
  action
) => {
  switch (action.type) {
    case AVAILABLE_TIME_LIST_REQUEST:
      return { loading: true, availableTimes: [] };
    case AVAILABLE_TIME_LIST_SUCCESS:
      return { loading: false, availableTimes: action.payload };
    case AVAILABLE_TIME_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const availableTimeCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case AVAILABLE_TIME_CREATE_REQUEST:
      return { loading: true };
    case AVAILABLE_TIME_CREATE_SUCCESS:
      return { loading: false, success: true };
    case AVAILABLE_TIME_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case AVAILABLE_TIME_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const availableTimeUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case AVAILABLE_TIME_UPDATE_REQUEST:
      return { loading: true };
    case AVAILABLE_TIME_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case AVAILABLE_TIME_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case AVAILABLE_TIME_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const availableTimeDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case AVAILABLE_TIME_DELETE_REQUEST:
      return { loading: true };
    case AVAILABLE_TIME_DELETE_SUCCESS:
      return { loading: false, success: true };
    case AVAILABLE_TIME_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
