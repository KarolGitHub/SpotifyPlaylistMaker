import * as actionTypes from "../actions/actionsTypes";
import { updateObject } from "../../shared/utility";

type Tracklist = Array<{
  title: string;
  artist: string;
  album?: string;
  year?: string;
  length?: string;
}>;

type State = {
  playlist: Tracklist;
  searchResults: Tracklist;
  error: false;
  loading: false;
};
const initialState: State = {
  playlist: [],
  searchResults: [
    {
      title: "Dr. Online",
      artist: "Zeromancer",
      year: "2000",
      length: "3:15",
    },
    {
      title: "Something You Need",
      artist: "Against The Current",
      year: "2000",
      album: "Infinity",
      length: "3:56",
    },
    {
      title: "Violet",
      artist: "The Birthday Massacre",
      album: "Violet",
      length: "3:37",
    },
    {
      title: "Kill the Lights",
      artist: "The Birthday Massacre",
      length: "3:30",
      year: "2007",
    },
  ],
  error: false,
  loading: false,
};

const addTrack = (state: State, action: { type: string; id: number }) => {
  return updateObject(state, {
    playlist: state.playlist.concat(state.searchResults[action.id]),
  });
};

const deleteTrack = (state: State, action: { type: string; id: number }) => {
  return updateObject(state, {
    playlist: state.playlist.filter((_, index) => index !== action.id),
  });
};

const reducer = (
  state = initialState,
  action: { type: string; id: number }
) => {
  switch (action.type) {
    case actionTypes.ADD_TRACK:
      return addTrack(state, action);
    case actionTypes.DELETE_TRACK:
      return deleteTrack(state, action);
    default:
      return state;
  }
};

export default reducer;
