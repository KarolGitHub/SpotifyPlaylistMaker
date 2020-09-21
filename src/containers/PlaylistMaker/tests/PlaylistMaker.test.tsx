import React from "react";
import { shallow, mount } from "enzyme";
import configureMockStore from 'redux-mock-store';
import * as actionTypes from '../../../store/actions/actionsTypes';
import * as actions from '../../../store/actions/index';
import { initialState as playlistMakerState } from '../../../store/reducers/playlistMaker';
import { initialState as playlistsState } from '../../../store/reducers/playlists';
import { initialState as playerState } from '../../../store/reducers/player';
import { initialState as authState } from '../../../store/reducers/auth';
import PlaylistMaker from "../PlaylistMaker";
import Playlist from "../Playlist/Playlist";
import { Provider } from "react-redux";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import { act } from "react-dom/test-utils";

const middlewares: any = [];
const mockStore = configureMockStore(middlewares);

describe("<PlaylistMaker />", () => {
  describe("Unit tests", () => {
    let wrapper: any;
    beforeEach(() => {
      wrapper = shallow(<PlaylistMaker />);
    });

    it('render without crashing', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should render <Playlist />", () => {
      expect(wrapper.find(Playlist)).toEqual({});
    });

  });
  describe("Integration tests", () => {
    let store: any;
    beforeEach(() => {
      store = mockStore({
        playlistMaker: playlistMakerState,
        auth: authState,
        player: playerState,
        playlists: playlistsState
      });
    });

    it("should dispatch an action on button click", () => {
      act(() => {
        const wrapper = mount(
          <Provider store={store}>
            <PlaylistMaker />
          </Provider>
        );
        store.dispatch(actions.authSuccess('token', 'id'));
        const asyncCheck = setImmediate(() => {
          wrapper.update();
          expect(store.getState()).toContainEqual({
            token: 'token',
            userId: 'id',
            error: null,
            loading: false,
            authRedirectPath: 'https://accounts.spotify.com/authorize?client_id=4ab35e6f4e00492f9af5a2358e409f9f&redirect_uri=http://localhost:3000/login&scope=playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative&response_type=token&state=123',
          });
        });
        wrapper.find(Input).at(4).props().changed({ target: { value: 'text' } });
        wrapper.find(Button).at(2).simulate('click');
        const asyncCheck2 = setImmediate(() => {
          wrapper.update();
          expect(store.getActions()).toContainEqual([{
            type: actionTypes.SEARCH_TRACKS,
            token: 'token',
            userId: 'id',
            term: 'text',
            limit: 10,
          }]);
        });
        global.clearImmediate(asyncCheck);
        global.clearImmediate(asyncCheck2);
        wrapper.unmount();
      });
    });
  });
});
