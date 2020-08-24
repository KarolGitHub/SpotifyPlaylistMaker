import * as actionTypes from "../actions/actionsTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  token: null,
  error: null,
  loading: false,
  authRedirectPath: null,
};

const reducer = (
  state = initialState,
  action: {
    type: string;
    token: string;
    error: string;
    url: string;
  }
) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return updateObject(state, { error: null, loading: true });
    case actionTypes.AUTH_SUCCESS:
      return updateObject(state, {
        token: action.token,
        authRedirectPath: null,
        error: null,
        loading: false,
      });
    case actionTypes.AUTH_LOGOUT:
      return updateObject(state, { token: null });
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