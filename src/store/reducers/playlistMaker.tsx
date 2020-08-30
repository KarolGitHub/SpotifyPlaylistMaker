import * as actionTypes from "../actions/actionsTypes";
import { updateObject, Tracklist, arrayDiff } from "../../shared/utility";

type State = {
  playlist: Tracklist;
  searchResults: Tracklist;
  searchResultsLimit: number;
  addedTrackIDs: Array<string>;
  error: any;
  loading: boolean;
  saveResult: boolean;
};
type Action = {
  type: string;
  index: number;
  id: string;
  tracklist: Tracklist;
  searchResultsLimit: number;
  error: any;
};
const initialState: State = {
  playlist: [],
  searchResults: [],
  searchResultsLimit: 20,
  addedTrackIDs: [],
  error: null,
  loading: false,
  saveResult: false,
};

const addTrack = (state: State, action: Action) => {
  return updateObject(state, {
    playlist: state.playlist.concat(state.searchResults[action.index]),
    addedTrackIDs: [...state.addedTrackIDs, action.id],
  });
};

const deleteTrack = (state: State, action: Action) => {
  return updateObject(state, {
    playlist: state.playlist.filter((_, index) => index !== action.index),
    addedTrackIDs: state.addedTrackIDs.filter((id) => id !== action.id),
  });
};

const searchTracksStart = (state: State, action: Action) => {
  return updateObject(state, {
    loading: true,
    searchResultsLimit: action.searchResultsLimit,
  });
};
const searchTracksSuccess = (state: State, action: Action) => {
  return updateObject(state, {
    searchResults: arrayDiff(action.tracklist, state.playlist),
    loading: false,
  });
};
const searchTracksFail = (state: State, action: Action) => {
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
const savePlaylistFail = (state: State, action: Action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.ADD_TRACK:
      return addTrack(state, action);
    case actionTypes.DELETE_TRACK:
      return deleteTrack(state, action);
    case actionTypes.SEARCH_TRACKS_START:
      return searchTracksStart(state, action);
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
