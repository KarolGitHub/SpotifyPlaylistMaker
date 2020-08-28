import * as actionTypes from "./actionsTypes";
import axios from "../../axios-spotify";
import { Dispatch } from "redux";
import { Tracklist } from "../../shared/utility";
import { AxiosResponse, AxiosError } from "axios";

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

export const savePlaylistStart = () => {
  return {
    type: actionTypes.SAVE_PLAYLIST_START,
  };
};

export const savePlaylist = (
  accessToken: string,
  name: string,
  trackURIs: Array<string>
) => {
  return (dispatch: Dispatch) => {
    dispatch(savePlaylistStart());
    // const accessToken = getAccessToken(token);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    let userId: any;
    axios
      .get("/me", { headers: headers })
      .then((response) => JSON.parse(JSON.stringify(response)))
      .then((response: AxiosResponse) => {
        userId = response.data.id;
        const queryParams = `users/${userId}/playlists`;
        return axios.post(
          queryParams,
          JSON.stringify({
            name: name,
            description: "",
            public: false,
          }),
          { headers: headers }
        );
      })
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
        if (error.response) {
          dispatch(savePlaylistFail(error.response.data.error));
        } else if (error.message) {
          dispatch(savePlaylistFail(error.message));
        } else {
          dispatch(savePlaylistFail("Unexpected Error!"));
        }
      });
  };
};

export const savePlaylistSuccess = () => {
  return {
    type: actionTypes.SAVE_PLAYLIST_SUCCESS,
  };
};
export const successConfirm = () => {
  return {
    type: actionTypes.SUCCESS_CONFIRM,
  };
};

export const savePlaylistFail = (error: string) => {
  return {
    type: actionTypes.SAVE_PLAYLIST_FAIL,
    error: error,
  };
};

export const searchTracksStart = () => {
  return {
    type: actionTypes.SEARCH_TRACKS_START,
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
  searchType: string,
  term: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(searchTracksStart());
    // const accessToken = getAccessToken(token);
    const queryParams = `search?type=${searchType}&limit=50&q=${term}`;
    axios
      .get(queryParams, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => JSON.parse(JSON.stringify(response)))
      .then((response) => {
        const tracks = response.data.tracks.items.map((track: any) => ({
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
        if (error.response) {
          dispatch(searchTracksFail(error.response.data.error));
        } else if (error.message) {
          dispatch(searchTracksFail(error.message));
        } else {
          dispatch(searchTracksFail("Unexpected Error!"));
        }
      });
  };
};
