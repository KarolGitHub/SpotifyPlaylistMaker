import * as actionTypes from "./actionsTypes";

export const addTrack = (id: number) => {
  return {
    type: actionTypes.ADD_TRACK,
    id: id,
  };
};
export const deleteTrack = (id: number) => {
  return {
    type: actionTypes.DELETE_TRACK,
    id: id,
  };
};
