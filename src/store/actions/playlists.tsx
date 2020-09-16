import * as actionTypes from "./actionsTypes";
import axios from "../../axios-spotify";
import { Dispatch } from "redux";
import {
  updateObject,
  updateArray,
  SpotifyTrack,
  Playlist,
  SpotifyPlaylist,
  PlaylistInfo,
} from "../../shared/utility";
import Axios, { AxiosResponse, AxiosError } from "axios";

export const fetchPlaylistsStart = () => {
  return {
    type: actionTypes.FETCH_PLAYLISTS_START,
  };
};
export const fetchPlaylists = (
  accessToken: string,
  userId: string,
  cancelToken: any
) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchPlaylistsStart());
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const queryParams = `users/${userId}/playlists?limit=50`;
    axios
      .get(queryParams, { headers: headers, cancelToken: cancelToken })
      .then((response: AxiosResponse) => JSON.parse(JSON.stringify(response)))
      .then((response: AxiosResponse) => {
        console.log(response.data.items);
        const playlists = updateArray(updateObject(response.data).items).map(
          (playlist: SpotifyPlaylist) => ({
            id: playlist.id,
            isEditable: playlist.collaborative || playlist.owner.id === userId,
            payload: {
              name: playlist.name,
              public: playlist.public,
              collaborative: playlist.collaborative,
              description: playlist.description,
            },
            tracks: updateObject(playlist.tracks),
          })
        );
        dispatch(fetchPlaylistsSuccess(playlists));
      })
      .catch((error: AxiosError) => {
        if (!Axios.isCancel(error)) {
          if (error.response?.data) {
            dispatch(fetchPlaylistsFail(error.response.data.error.message));
          } else if (error.message) {
            dispatch(fetchPlaylistsFail(error.message));
          } else {
            dispatch(fetchPlaylistsFail("Unexpected Error!"));
          }
        }
      });
  };
};
export const fetchPlaylistsSuccess = (playlists: Array<Playlist>) => {
  return {
    type: actionTypes.FETCH_PLAYLISTS_SUCCESS,
    playlists: playlists,
  };
};
export const fetchPlaylistsFail = (error: string) => {
  return {
    type: actionTypes.FETCH_PLAYLISTS_FAIL,
    error: error,
  };
};

export const fetchTracksStart = () => {
  return {
    type: actionTypes.FETCH_TRACKS_START,
  };
};
export const fetchTracks = (
  accessToken: string,
  info: PlaylistInfo,
  redirect: boolean
) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchTracksStart());
    const { id, isEditable, payload, uri } = updateObject(info);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    axios
      .get(uri, { headers: headers })
      .then((response: AxiosResponse) => JSON.parse(JSON.stringify(response)))
      .then((response: AxiosResponse) => {
        const tracks = updateArray(updateObject(response.data).items).map(
          (item: { track: SpotifyTrack }) => ({
            id: item.track.id,
            name: item.track.name,
            artist: item.track.artists[0].name,
            album: item.track.album.name,
            uri: item.track.uri,
            preview_url: item.track.preview_url,
          })
        );
        dispatch(
          fetchTracksSuccess(tracks, { id, isEditable, payload, uri }, redirect)
        );
      })
      .catch((error: AxiosError) => {
        if (error.response?.data) {
          dispatch(fetchTracksFail(error.response.data.error.message));
        } else if (error.message) {
          dispatch(fetchTracksFail(error.message));
        } else {
          dispatch(fetchTracksFail("Unexpected Error!"));
        }
      });
  };
};
export const fetchTracksSuccess = (
  tracks: Array<any>,
  playlistInfo: PlaylistInfo,
  redirect: boolean
) => {
  return {
    type: actionTypes.FETCH_TRACKS_SUCCESS,
    tracks: tracks,
    playlistInfo: playlistInfo,
    redirect: redirect,
  };
};
export const fetchTracksFail = (error: string) => {
  return {
    type: actionTypes.FETCH_TRACKS_FAIL,
    error: error,
  };
};

export const deleteTracksStart = () => {
  return {
    type: actionTypes.DELETE_TRACKS_START,
  };
};
export const deleteTracks = (
  accessToken: string,
  tracks: { tracks: { uri: string | null }[] },
  playlist_id?: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(deleteTracksStart());
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const queryParams = `playlists/${playlist_id}/tracks`;
    axios
      .delete(queryParams, { headers: headers, data: tracks })
      .then(() => dispatch(deleteTracksSuccess()))
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.response?.data) {
          dispatch(deleteTracksFail(error.response.data.error.message));
        } else if (error.message) {
          dispatch(deleteTracksFail(error.message));
        } else {
          dispatch(deleteTracksFail("Unexpected Error!"));
        }
      });
  };
};
export const deleteTracksSuccess = () => {
  return {
    type: actionTypes.DELETE_TRACKS_SUCCESS,
  };
};
export const deleteTracksFail = (error: string) => {
  return {
    type: actionTypes.DELETE_TRACKS_FAIL,
    error: error,
  };
};

export const clearPlaylist = () => {
  return {
    type: actionTypes.CLEAR_PLAYLIST,
  };
};

export const setRedirect = () => {
  return {
    type: actionTypes.SET_REDIRECT,
  };
};
