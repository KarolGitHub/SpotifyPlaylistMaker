import React, { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";

import classes from "./PlaylistMaker.module.scss";
import SearchBar from "./SearchBar/SearchBar";
import Playlist from "./Playlist/Playlist";
import SearchResults from "./SearchResults/SearchResults";
import Spinner from "./../../components/UI/Spinner/Spinner";
import Modal from "./../../components/UI/Modal/Modal";
import Checkout from "../../components/Playlist/Checkout/Checkout";
// import axios from "../../axios-spotify";
import { RootState } from "../../index";

type Props = {};

const PlaylistMaker: FunctionComponent<Props> = () => {
  const [isModal, setModal] = useState(false);

  const list = useSelector((state: RootState) => {
    return state.playlistMaker.playlist;
  });
  const results = useSelector((state: RootState) => {
    return state.playlistMaker.searchResults;
  });
  const loading = useSelector((state: RootState) => {
    return state.playlistMaker.loading;
  });
  const error = useSelector((state: RootState) => {
    return state.playlistMaker.error;
  });

  const modalHandler = (prevState: boolean) => {
    setModal(!prevState);
  };
  const savePlaylistHandler = () => {};

  const modal = (
    <Modal open={isModal} clicked={() => modalHandler(isModal)}>
      <Checkout
        cancel={() => modalHandler(isModal)}
        confirm={savePlaylistHandler}
      />
    </Modal>
  );

  return !error && !loading ? (
    <div className={classes.PlaylistMaker}>
      {modal}
      <div className={classes.SearchBar}>
        <SearchBar />
      </div>
      <div className={classes.Playlist}>
        <SearchResults tracklist={results} />
        <Playlist tracklist={list} clicked={() => modalHandler(isModal)} />
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

export default PlaylistMaker;
