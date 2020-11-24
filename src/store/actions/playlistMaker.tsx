import * as actionTypes from './actionsTypes';
import axios from '../../axios-spotify';
import { Dispatch } from 'redux';
import {
  Tracklist,
  updateObject,
  updateArray,
  PlaylistPayload,
} from '../../shared/utility';
import { AxiosResponse, AxiosError } from 'axios';

export const addTrack = (index: number) => {
  return {
    type: actionTypes.ADD_TRACK,
    index: index,
  };
};
export const deleteTrack = (index: number) => {
  return {
    type: actionTypes.DELETE_TRACK,
    index: index,
  };
};
export const moveTrack = (tracklists: {}) => {
  return {
    type: actionTypes.MOVE_TRACK,
    tracklists: tracklists,
  };
};

export const searchTracksStart = (limit: number) => {
  return {
    type: actionTypes.SEARCH_TRACKS_START,
    searchResultsLimit: limit,
  };
};
export const searchTracksSuccess = (tracklist: Tracklist) => {
  return {
    type: actionTypes.SEARCH_TRACKS_SUCCESS,
    tracklist: tracklist,
  };
};
export const searchTracksFail = (error: string) => {
  return {
    type: actionTypes.SEARCH_TRACKS_FAIL,
    error: error,
  };
};
export const searchTracks = (
  accessToken: string,
  country: string,
  searchType: string,
  term: string,
  limit: number
) => {
  return (dispatch: Dispatch) => {
    dispatch(searchTracksStart(limit));
    const queryParams = `search?type=${searchType}&limit=${limit}&q=${term}&market=${country}`;
    axios
      .get(queryParams, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => JSON.parse(JSON.stringify(response)))
      .then((response) => {
        const tracks = updateArray(
          updateObject(response.data).tracks.items
        ).map((track: any) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview_url: track.preview_url,
        }));
        dispatch(searchTracksSuccess(tracks));
      })
      .catch((error) => {
        if (error.response?.data) {
          dispatch(searchTracksFail(error.response.data.error.message));
        } else if (error.message) {
          dispatch(searchTracksFail(error.message));
        } else {
          dispatch(searchTracksFail('Unexpected Error!'));
        }
      });
  };
};

export const savePlaylistStart = () => {
  return {
    type: actionTypes.SAVE_PLAYLIST_START,
  };
};
export const savePlaylist = (
  accessToken: string,
  userId: string,
  userPayload: PlaylistPayload,
  trackURIs: Array<string>
) => {
  return (dispatch: Dispatch) => {
    dispatch(savePlaylistStart());
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const queryParams = `users/${userId}/playlists`;
    axios
      .post(queryParams, JSON.stringify(userPayload), { headers: headers })
      .then((response: AxiosResponse) => JSON.parse(JSON.stringify(response)))
      .then((response: AxiosResponse) => {
        const playlistId = response.data.id;
        const queryParams = `users/${userId}/playlists/${playlistId}/tracks`;
        return axios.post(
          queryParams,
          JSON.stringify({
            uris: trackURIs,
          }),
          { headers: headers }
        );
      })
      .then(() => {
        dispatch(savePlaylistSuccess());
      })
      .catch((error: AxiosError) => {
        if (error.response?.data) {
          dispatch(savePlaylistFail(error.response.data.error.message));
        } else if (error.message) {
          dispatch(savePlaylistFail(error.message));
        } else {
          dispatch(savePlaylistFail('Unexpected Error!'));
        }
      });
  };
};
export const savePlaylistSuccess = () => {
  return {
    type: actionTypes.SAVE_PLAYLIST_SUCCESS,
  };
};
export const savePlaylistFail = (error: string) => {
  return {
    type: actionTypes.SAVE_PLAYLIST_FAIL,
    error: error,
  };
};

export const editPlaylistStart = () => {
  return {
    type: actionTypes.EDIT_PLAYLIST_START,
  };
};
export const editPlaylist = (
  accessToken: string,
  user_id: string,
  userPayload: PlaylistPayload,
  trackURIs: Array<string>,
  changedDetails: boolean,
  playlist_id?: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(editPlaylistStart());
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const queryParams = `users/${user_id}/playlists/${playlist_id}`;
    axios
      .get(queryParams, { headers: headers })
      .then(() => {
        if (changedDetails) {
          return axios.put(queryParams, JSON.stringify(userPayload), {
            headers: headers,
          });
        }
      })
      .then(() => {
        return axios.post(
          queryParams + '/tracks',
          JSON.stringify({
            uris: trackURIs,
          }),
          { headers: headers }
        );
      })
      .then(() => {
        dispatch(editPlaylistSuccess());
      })
      .catch((error: AxiosError) => {
        if (error.response?.data) {
          dispatch(editPlaylistFail(error.response.data.error.message));
        } else if (error.message) {
          dispatch(editPlaylistFail(error.message));
        } else {
          dispatch(editPlaylistFail('Unexpected Error!'));
        }
      });
  };
};
export const editPlaylistSuccess = () => {
  return {
    type: actionTypes.EDIT_PLAYLIST_SUCCESS,
  };
};
export const editPlaylistFail = (error: string) => {
  return {
    type: actionTypes.EDIT_PLAYLIST_FAIL,
    error: error,
  };
};

export const successConfirm = () => {
  return {
    type: actionTypes.SUCCESS_CONFIRM,
  };
};

export const setTracks = (tracklist: {}) => {
  return {
    type: actionTypes.SET_TRACKS,
    tracklist: tracklist,
  };
};
