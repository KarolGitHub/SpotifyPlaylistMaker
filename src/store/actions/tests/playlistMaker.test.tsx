import configureMockStore from "redux-mock-store";
import * as actionTypes from "../actionsTypes";
import * as actions from "../index";
import reducer from "../../reducers/playlistMaker";
import { Tracklist, Track } from "../../../shared/utility";
import { initialState } from "../../reducers/playlistMaker";
const middlewares: any = [];
const mockStore = configureMockStore(middlewares);

describe("PlaylistMaker store", () => {
  const track: Track = {
    id: "id",
    name: "",
    album: "",
    artist: "",
    uri: "",
    preview_url: "",
  };
  const tracklist: Tracklist = [];
  describe("reducer should handle incoming actions", () => {
    it("return initial state on default", () => {
      expect(reducer()).toMatchSnapshot();
    });

    it("setTracks", () => {
      expect(
        reducer(initialState, {
          type: actionTypes.SET_TRACKS,
          index: 1,
          id: "id",
          tracklist: tracklist,
          searchResultsLimit: 10,
          error: null,
        })
      ).toMatchSnapshot();
    });
  });
  describe("action creators should dispatch actions", () => {
    let store: any;

    beforeEach(() => {
      store = mockStore(initialState);
    });

    it("setTracks", () => {
      store.dispatch(actions.setTracks(tracklist));
      expect(store.getActions()).toEqual([
        {
          type: actionTypes.SET_TRACKS,
          tracklist: [],
        },
      ]);
    });

    it("addTrack", () => {
      store.dispatch(actions.searchTracksSuccess([track]));
      store.dispatch(actions.addTrack(1, "id"));
      expect(store.getActions()).toEqual([
        {
          type: actionTypes.SEARCH_TRACKS_SUCCESS,
          tracklist: [
            {
              album: "",
              artist: "",
              id: "id",
              name: "",
              preview_url: "",
              uri: "",
            },
          ],
        },
        {
          type: actionTypes.ADD_TRACK,
          index: 1,
          id: "id",
        },
      ]);
      expect(store.getState()).toEqual({
        playlist: [],
        searchResults: [],
        searchResultsLimit: 20,
        addedTrackIDs: [],
        error: null,
        loading: false,
        saveResult: false,
      });
    });
  });
});
