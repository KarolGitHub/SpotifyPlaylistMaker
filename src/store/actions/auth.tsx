import * as actionTypes from "./actionsTypes";
import { prefixURL, client_id, redirect_uri} from "../../axios-spotify";
import { Dispatch } from "redux";
import { AxiosResponse, AxiosError } from "axios";
import axios from "../../axios-spotify";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token: string, id: string) => {
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

export const setAuthRedirectURL = () => {
  const queryParams =
    "?client_id=" +
    client_id +
    "&redirect_uri=" +
    redirect_uri +
    "&scope=" +
    "playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative" +
    "&response_type=token" +
    "&state=123";
  // "&show_dialog=true";
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
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };
        axios
          .get("/me", { headers: headers })
          .then((response) => JSON.parse(JSON.stringify(response)))
          .then((response: AxiosResponse) => {
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem(
              "expirationDate",
              date.setSeconds(date.getSeconds() + expiresIn).toString()
            );
            localStorage.setItem("token", accessToken);
          })
          .then(() => window.close())
          .catch((error: AxiosError) => {
            if (error.response?.data) {
              dispatch(authFail(error.response.data.error.message));
            } else if (error.message) {
              dispatch(authFail(error.message));
            } else {
              dispatch(authFail("Unexpected Error!"));
            }
          });
      } else {
        dispatch(authFail("Authentication Error"));
      }
    } else {
      dispatch(authFail(error[1]));
      window.close();
    }
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, (expirationTime - 5) * 1000);
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authCheckState = () => {
  return (dispatch: Dispatch) => {
    window.removeEventListener("storage", () => { });
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      dispatch(logout());
    } else {
      let expirationDate = new Date(
        Number(localStorage.getItem("expirationDate"))
      );
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, userId));
        checkAuthTimeout(
          (expirationDate.getTime() - Number(new Date().getTime())) / 1000
        );
      }
    }
  };
};
