import * as actionTypes from "./actionsTypes";

export const logout = () => {
  return {
    type: actionTypes.AUTH_INIT_LOGOUT,
  };
};

export const didLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};
export const authSuccess = (token: string, id: string) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: id,
  };
};
export const checkAuthTimeout = (expirationTime: string) => {
  return {
    type: actionTypes.AUTH_CHECK_TIMEOUT,
    expirationTime: expirationTime,
  };
};

export const authFail = (error: string) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const auth = (email: string, password: string, isSignup: boolean) => {
  return {
    type: actionTypes.AUTH_USER,
    email: email,
    password: password,
    isSignup: isSignup,
  };
};

export const authCheckState = () => {
  return {
    type: actionTypes.AUTH_CHECK_STATE,
  };
};
