import * as actionTypes from "../actions/actionsTypes";
import { updateObject } from "../../shared/utility";

export const initialState = {
  token: null,
  userId: null,
  country: null,
  error: null,
  loading: false,
  authRedirectPath: null,
};

const reducer = (
  state = initialState,
  action?: {
    type: string;
    token: string;
    userId: string;
    country: string;
    error: any;
    url: string;
  }
) => {
  switch (action?.type) {
    case actionTypes.AUTH_START:
      return updateObject(state, { error: null, loading: true });
    case actionTypes.AUTH_SUCCESS:
      return updateObject(state, {
        token: action.token,
        userId: action.userId,
        country: action.country,
        authRedirectPath: null,
        error: null,
        loading: false,
      });
    case actionTypes.AUTH_LOGOUT:
      return updateObject(state, { token: null, userId: null, country: null });
    case actionTypes.SET_AUTH_REDIRECT_URL:
      return updateObject(state, { authRedirectPath: action.url });
    case actionTypes.AUTH_FAIL:
      return updateObject(state, {
        authRedirectPath: null,
        error: action.error,
        loading: false,
      });
    default:
      return state;
  }
};

export default reducer;
