import * as actionTypes from "../actions/actionsTypes";
import { updateObject, Tracklist, arrayDiff } from "../../shared/utility";

type State = {
  playlist: Tracklist;
  searchResults: Tracklist;
  error: any;
  loading: boolean;
  saveResult: boolean;
};
type Action = {
  type: string;
  id: string;
  tracklist: Tracklist;
  error: any;
};
const initialState: State = {
  playlist: [],
  error: null,
  loading: false,
  saveResult: false,
  searchResults: [
    /*  {
      id: "1",
      name: "Dr. Online",
      artist: "Zeromancer",
      album: "Dr. Online",
      uri: "123",
    },
    {
      id: "2",
      name: "Something You Need",
      artist: "Against The Current",
      album: "Infinity",
      uri: "123123",
    },
    {
      id: "3",
      name: "Violet",
      artist: "The Birthday Massacre",
      album: "Violet",
      uri: "123123",
    },
    {
      id: "4",
      name: "Kill the Lights",
      artist: "The Birthday Massacre",
      album: "Violet",
      uri: "23452435",
    }, */
  ],
};

const addTrack = (state: State, action: Action) => {
  return updateObject(state, {
    playlist: state.playlist.concat(state.searchResults[+action.id]),
  });
};

const deleteTrack = (state: State, action: { id: string }) => {
  return updateObject(state, {
    playlist: state.playlist.filter((_, index) => index !== +action.id),
  });
};

const searchTracksStart = (state: State) => {
  return updateObject(state, { loading: true });
};
const searchTracksSuccess = (
  state: State,
  action: { tracklist: Tracklist }
) => {
  return updateObject(state, {
    searchResults: arrayDiff(action.tracklist, state.playlist),
    loading: false,
  });
};
const searchTracksFail = (state: State, action: { error: string }) => {
  return updateObject(state, { error: action.error, loading: false });
};
const savePlaylistStart = (state: State) => {
  return updateObject(state, { loading: true });
};
const savePlaylistSuccess = (state: State) => {
  return updateObject(state, { loading: false, saveResult: true });
};
const successConfirm = (state: State) => {
  return updateObject(state, { saveResult: false });
};
const savePlaylistFail = (state: State, action: { error: string }) => {
  return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.ADD_TRACK:
      return addTrack(state, action);
    case actionTypes.DELETE_TRACK:
      return deleteTrack(state, action);
    case actionTypes.SEARCH_TRACKS_START:
      return searchTracksStart(state);
    case actionTypes.SEARCH_TRACKS_SUCCESS:
      return searchTracksSuccess(state, action);
    case actionTypes.SEARCH_TRACKS_FAIL:
      return searchTracksFail(state, action);
    case actionTypes.SAVE_PLAYLIST_START:
      return savePlaylistStart(state);
    case actionTypes.SAVE_PLAYLIST_SUCCESS:
      return savePlaylistSuccess(state);
    case actionTypes.SUCCESS_CONFIRM:
      return successConfirm(state);
    case actionTypes.SAVE_PLAYLIST_FAIL:
      return savePlaylistFail(state, action);
    default:
      return state;
  }
};

export default reducer;
