import * as actionTypes from "../actions/actionsTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: "/",
};

const reducer = (
  state = initialState,
  action: {
    type: string;
    token: string;
    userId: string;
    error: string;
    path: string;
  }
) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return updateObject(state, { error: null, loading: true });
    case actionTypes.AUTH_SUCCESS:
      return updateObject(state, {
        token: action.token,
        userId: action.userId,
        error: null,
        loading: false,
      });
    case actionTypes.AUTH_LOGOUT:
      return updateObject(state, { token: null, userId: null });
    case actionTypes.AUTH_REDIRECT:
      return updateObject(state, { authRedirectPath: action.path });
    case actionTypes.AUTH_FAIL:
      return updateObject(state, { error: action.error, loading: false });
    default:
      return state;
  }
};

export default reducer;
