import * as actionTypes from '../actions/actionsTypes';
import {
  updateObject,
  Playlist,
  Tracklist,
  updateArray,
  PlaylistInfo,
} from '../../shared/utility';

type State = {
  playlists: Array<Playlist>;
  tracks: Tracklist;
  error: any;
  loading: boolean;
  playlistInfo: PlaylistInfo | null;
  redirect: boolean;
};
type Action = {
  type: string;
  playlists: Array<Playlist>;
  tracks: Tracklist;
  error: any;
  playlistInfo: PlaylistInfo | null;
  redirect: boolean;
};
export const initialState: State = {
  playlists: [],
  tracks: [],
  error: null,
  loading: false,
  playlistInfo: null,
  redirect: false,
};
const fetchPlaylistsStart = (state: State) => {
  return updateObject(state, { loading: true });
};
const fetchPlaylistsSuccess = (state: State, action: Action) => {
  return updateObject(state, {
    playlists: updateArray(action.playlists),
    loading: false,
  });
};
const fetchPlaylistsFail = (state: State, action: Action) => {
  return updateObject(state, { loading: false, error: action.error });
};
const fetchTracksStart = (state: State) => {
  return updateObject(state, { loading: true });
};
const fetchTracksSuccess = (state: State, action: Action) => {
  return updateObject(state, {
    tracks: action.tracks,
    playlistInfo: action.playlistInfo,
    redirect: action.redirect,
    loading: false,
  });
};
const fetchTracksFail = (state: State, action: Action) => {
  return updateObject(state, { loading: false, error: action.error });
};
const deleteTracksStart = (state: State) => {
  return updateObject(state, { loading: true });
};
const deleteTracksSuccess = (state: State) => {
  return updateObject(state, { loading: false, playlists: [] });
};
const deleteTracksFail = (state: State, action: Action) => {
  return updateObject(state, { loading: false, error: action.error });
};
const clearPlaylist = (state: State) => {
  return updateObject(state, { playlistInfo: null, error: null, tracks: [] });
};
const setRedirect = (state: State) => {
  return updateObject(state, { redirect: false });
};

const reducer = (state: State = initialState, action?: Action) => {
  switch (action?.type) {
    case actionTypes.FETCH_PLAYLISTS_START:
      return fetchPlaylistsStart(state);
    case actionTypes.FETCH_PLAYLISTS_SUCCESS:
      return fetchPlaylistsSuccess(state, action);
    case actionTypes.FETCH_PLAYLISTS_FAIL:
      return fetchPlaylistsFail(state, action);
    case actionTypes.FETCH_TRACKS_START:
      return fetchTracksStart(state);
    case actionTypes.FETCH_TRACKS_SUCCESS:
      return fetchTracksSuccess(state, action);
    case actionTypes.FETCH_TRACKS_FAIL:
      return fetchTracksFail(state, action);
    case actionTypes.DELETE_TRACKS_START:
      return deleteTracksStart(state);
    case actionTypes.DELETE_TRACKS_SUCCESS:
      return deleteTracksSuccess(state);
    case actionTypes.DELETE_TRACKS_FAIL:
      return deleteTracksFail(state, action);
    case actionTypes.CLEAR_PLAYLIST:
      return clearPlaylist(state);
    case actionTypes.SET_REDIRECT:
      return setRedirect(state);
    default:
      return state;
  }
};

export default reducer;
