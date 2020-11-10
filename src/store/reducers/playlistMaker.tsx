import * as actionTypes from "../actions/actionsTypes";
import {
  updateObject,
  Tracklist,
  tracksDiff,
  Track,
  spreadNestedObject,
} from "../../shared/utility";

type State = {
  playlist: Tracklist;
  searchResults: Tracklist;
  searchResultsLimit: number;
  error: any;
  loading: boolean;
  saveResult: boolean;
};
type Action = {
  type: string;
  index: number;
  track: Track;
  tracklist: Tracklist;
  searchResultsLimit: number;
  error: any;
  tracklists: {};
};
export const initialState: State = {
  playlist: [],
  searchResults: [],
  searchResultsLimit: 20,
  error: null,
  loading: false,
  saveResult: false,
};

const addTrack = (state: State, action: Action) => {
  return updateObject(state, {
    playlist: state.playlist.concat(state.searchResults[action.index]),
    searchResults: state.searchResults.filter(
      (_, index) => index !== action.index
    ),
  });
};

const deleteTrack = (state: State, action: Action) => {
  return updateObject(state, {
    playlist: state.playlist.filter((_, index) => index !== action.index),
  });
};
const moveTrack = (state: State, action: Action) => {
  return updateObject(state, spreadNestedObject(action.tracklists));
};

const searchTracksStart = (state: State, action: Action) => {
  return updateObject(state, {
    loading: true,
    searchResultsLimit: action.searchResultsLimit,
  });
};
const searchTracksSuccess = (state: State, action: Action) => {
  return updateObject(state, {
    searchResults: tracksDiff(action.tracklist, state.playlist),
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
const savePlaylistFail = (state: State, action: Action) => {
  return updateObject(state, { error: action.error, loading: false });
};
const editPlaylistStart = (state: State) => {
  return updateObject(state, { loading: true });
};
const editPlaylistSuccess = (state: State) => {
  return updateObject(state, { loading: false, saveResult: true });
};
const editPlaylistFail = (state: State, action: Action) => {
  return updateObject(state, { error: action.error, loading: false });
};
const successConfirm = (state: State) => {
  return updateObject(state, { saveResult: false });
};
const setTracks = (state: State, action: Action) => {
  return updateObject(
    state,
    updateObject(spreadNestedObject(action.tracklist), {
      error: null,
    })
  );
};

const reducer = (state: State = initialState, action?: Action) => {
  switch (action?.type) {
    case actionTypes.ADD_TRACK:
      return addTrack(state, action);
    case actionTypes.DELETE_TRACK:
      return deleteTrack(state, action);
    case actionTypes.MOVE_TRACK:
      return moveTrack(state, action);
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
    case actionTypes.SAVE_PLAYLIST_FAIL:
      return savePlaylistFail(state, action);
    case actionTypes.EDIT_PLAYLIST_START:
      return editPlaylistStart(state);
    case actionTypes.EDIT_PLAYLIST_SUCCESS:
      return editPlaylistSuccess(state);
    case actionTypes.EDIT_PLAYLIST_FAIL:
      return editPlaylistFail(state, action);
    case actionTypes.SUCCESS_CONFIRM:
      return successConfirm(state);
    case actionTypes.SET_TRACKS:
      return setTracks(state, action);
    default:
      return state;
  }
};

export default reducer;
