import * as actionTypes from "../actions/actionsTypes";
import { Tuple } from "../../shared/utility";

export const playTrackStart = (playerState: Tuple) => {
  return {
    type: actionTypes.PLAY_TRACK_START,
    playerState: [playerState[0], true, playerState[2]],
  };
};
export const playTrackPause = (playerState: Tuple) => {
  return {
    type: actionTypes.PLAY_TRACK_PAUSE,
    playerState: [playerState[0], false, playerState[2]],
  };
};
export const playTrackEnd = () => {
  return {
    type: actionTypes.PLAY_TRACK_END,
  };
};
export const playTrackFail = (error: any) => {
  return {
    type: actionTypes.PLAY_TRACK_FAIL,
    error: error,
  };
};
