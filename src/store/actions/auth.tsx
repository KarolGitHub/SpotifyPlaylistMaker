import * as actionTypes from "./actionsTypes";
import { prefixURL, client_id, redirect_uri } from "../../axios-spotify";
import { Dispatch } from "redux";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token: string) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
  };
};

export const authFail = (error: string) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const setAuthRedirectURL = () => {
  const queryParams =
    "?client_id=" +
    client_id +
    "&redirect_uri=" +
    redirect_uri +
    "&scope=" +
    "playlist-modify-public playlist-modify-private" +
    "&response_type=token" +
    "&state=123";
  const url = prefixURL + "authorize" + queryParams;
  return {
    type: actionTypes.SET_AUTH_REDIRECT_URL,
    url: url,
  };
};

export const auth = () => {
  return (dispatch: Dispatch) => {
    dispatch(authStart());
    const error = window.location.href.match(/error=([^&]*)/);
    if (!error) {
      const accessTokenMatch = window.location.href.match(
        /access_token=([^&]*)/
      );
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      const validateState = window.location.href.match(/state=([^&]*)/);
      if (
        accessTokenMatch &&
        expiresInMatch &&
        validateState &&
        validateState[1] === "123"
      ) {
        const accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        const date = new Date();
        localStorage.setItem("token", accessToken);
        localStorage.setItem(
          "expirationDate",
          date.setSeconds(date.getSeconds() + expiresIn).toString()
        );
        // dispatch(authSuccess(accessToken));
        // dispatch(checkAuthTimeout(expiresIn));
      } else {
        dispatch(authFail("Unexpected Error"));
      }
    } else {
      dispatch(authFail(error[1]));
    }
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authCheckState = () => {
  return (dispatch: Dispatch) => {
    window.removeEventListener("beforeunload", () => {});
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      let expirationDate = new Date(
        Number(localStorage.getItem("expirationDate"))
      );
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        checkAuthTimeout(
          (expirationDate.getTime() - Number(new Date().getTime())) / 1000
        );
      }
    }
  };
};
