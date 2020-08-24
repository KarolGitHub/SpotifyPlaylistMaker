import * as actionTypes from "../actions/actionsTypes";
import { updateObject, Tuple } from "../../shared/utility";

const initialState = {
  playerState: null,
  error: null,
};

const reducer = (
  state = initialState,
  action: {
    type: string;
    playerState: Tuple | null;
    error: any;
  }
) => {
  switch (action.type) {
    case actionTypes.PLAY_TRACK_START:
      return updateObject(state, { playerState: action.playerState });
    case actionTypes.PLAY_TRACK_PAUSE:
      return updateObject(state, { playerState: action.playerState });
    case actionTypes.PLAY_TRACK_END:
      return updateObject(state, { playerState: null });
    case actionTypes.PLAY_TRACK_FAIL:
      return updateObject(state, { error: action.error });
    default:
      return state;
  }
};

export default reducer;