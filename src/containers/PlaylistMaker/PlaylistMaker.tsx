import React, { FunctionComponent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import classes from "./PlaylistMaker.module.scss";
import SearchBar from "./SearchBar/SearchBar";
import Playlist from "./Playlist/Playlist";
import SearchResults from "./SearchResults/SearchResults";
import Spinner from "./../../components/UI/Spinner/Spinner";
import Modal from "./../../components/UI/Modal/Modal";
import Checkout from "../../components/Playlist/Checkout/Checkout";
// import axios from "../../axios-spotify";
import { Track, Tracklist } from "./../../shared/utility";
import { RootState } from "../../index";
import * as actions from "./../../store/actions/index";

type Props = {};

const PlaylistMaker: FunctionComponent<Props> = () => {
  const [isModal, setModal] = useState(false);
  // const [isSignup, setSignup] = useState(false);

  const dispatch = useDispatch();

  const onTracksSearch = (type: string, term: string) =>
    dispatch(actions.searchTracks(token, false, type, term));
  const onPlaylistSave = (name: string, trackURIs: Array<string>) =>
    dispatch(actions.savePlaylist(token, false, name, trackURIs));

  const list: Tracklist = useSelector((state: RootState) => {
    return state.playlistMaker.playlist;
  });
  const results: Tracklist = useSelector((state: RootState) => {
    return state.playlistMaker.searchResults;
  });
  const loading: boolean = useSelector((state: RootState) => {
    return state.playlistMaker.loading;
  });
  const error: boolean = useSelector((state: RootState) => {
    return state.playlistMaker.error;
  });
  const token: string = useSelector((state: RootState) => {
    return state.auth.token;
  });

  const modalHandler = (prevState: boolean) => {
    setModal(!prevState);
  };
  const savePlaylistHandler = (val: string) => {
    const trackURIs: Array<string> = [];
    list.map((track: Track) => trackURIs.push(track.uri));
    onPlaylistSave(val, trackURIs);
  };

  const searchHandler = (type: string, term: string) => {
    onTracksSearch(type, term);
  };

  const modal = (
    <Modal open={isModal} clicked={() => modalHandler(isModal)}>
      <Checkout
        cancel={() => modalHandler(isModal)}
        confirm={(val: string) => savePlaylistHandler(val)}
      />
    </Modal>
  );

  return !error && !loading ? (
    <div className={classes.PlaylistMaker}>
      {modal}
      <div className={classes.SearchBar}>
        <SearchBar clicked={(val: string) => searchHandler("track", val)} />
      </div>
      {results ? (
        <div className={classes.Playlist}>
          <SearchResults tracklist={results} />
          <Playlist tracklist={list} clicked={() => modalHandler(isModal)} />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  ) : (
    <Spinner />
  );
};

export default PlaylistMaker;
