import * as actionTypes from "./actionsTypes";
import axios, {prefixURL, client_id, redirect_uri} from '../../axios-spotify';
import { Dispatch } from 'redux';

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

export const auth = (isSignup: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch(authStart());
    const authData = {
      returnSecureToken: true
    };
    const queryParams = 
    "?client_id=" +
    client_id +
    '&redirect_uri' +
    redirect_uri +
    '&response_type="token"' +
    '"';
    let url = prefixURL;
    if (!isSignup) {
      url = prefixURL + 'authorize';
    }
    axios.post(url, authData)
      .then(response => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expirationDate', expirationDate.toString());
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data.token, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  setTimeout(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }, expirationTime * 1000);
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const setAuthRedirectPath = (path: string) => {
  return {
    type: actionTypes.AUTH_REDIRECT,
    path: path
  };
};

export const authCheckState = () => {
  return (dispatch: Dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(Number(localStorage.getItem('expirationDate')));
      console.log(expirationDate);
      expirationDate.setDate(expirationDate.getDate() + 7);
      console.log(expirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};


