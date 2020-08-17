import * as actionTypes from "./actionsTypes";
import axios, { prefixURL, client_id, redirect_uri } from "../../axios-spotify";
import { Dispatch } from "redux";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token: string, id: string | null) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: id,
  };
};

export const authFail = (error: string) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const getAccessToken = (accessToken: string, isSignup: boolean) => {
  if (accessToken) {
    return accessToken;
  }
  const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
  const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  if (accessTokenMatch && expiresInMatch) {
    accessToken = accessTokenMatch[1];
    const expiresIn = Number(expiresInMatch[1]);
    window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
    window.history.pushState("Access Token", "/");
    return accessToken;
  } else {
    const queryParams =
      "?client_id=" +
      client_id +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri) +
      "&scope=" +
      encodeURIComponent("playlist-modify-public playlist-modify-private") +
      "&response_type=token";
    let url = prefixURL;
    if (!isSignup) {
      url = prefixURL + "authorize";
    }
    window.location.href = url + queryParams;
    // return url + queryParams;
  }
};

export const auth = (token: string, isSignup: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch(authStart());
    const accessToken = getAccessToken(token, isSignup);
    axios
      .get(accessToken ? accessToken : "token")
      .then((response) => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("expirationDate", expirationDate.toString());
        localStorage.setItem("userId", response.data.localId);
        dispatch(authSuccess(response.data.token, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((error) => {
        if (error.response) {
          dispatch(authFail(error.response.data.error));
        } else if (error.message) {
          dispatch(authFail(error.message));
        } else {
          dispatch(authFail("Unexpected Error!"));
        }
      });
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
  }, expirationTime * 1000);
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const setAuthRedirectPath = (path: string) => {
  return {
    type: actionTypes.AUTH_REDIRECT,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch: Dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(
        Number(localStorage.getItem("expirationDate"))
      );
      console.log(expirationDate);
      expirationDate.setDate(expirationDate.getDate() + 7);
      console.log(expirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
