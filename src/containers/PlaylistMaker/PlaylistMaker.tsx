import React, { FunctionComponent, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";

import classes from "./PlaylistMaker.module.scss";
import SearchBar from "./SearchBar/SearchBar";
import Playlist from "./Playlist/Playlist";
import SearchResults from "./SearchResults/SearchResults";
import Spinner from "./../../components/UI/Spinner/Spinner";
import Modal from "./../../components/UI/Modal/Modal";
import Checkout from "../../components/Playlist/Checkout/Checkout";
import { Track, Tracklist, Tuple } from "./../../shared/utility";
import { RootState } from "../../index";
import errorHandler from "./../../Hoc/errorHandler/errorHandler";
import axios from "./../../axios-spotify";
import * as actions from "./../../store/actions/index";

const PlaylistMaker: FunctionComponent = () => {
  const [isModal, setModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

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
  const authRedirectPath: string = useSelector((state: RootState) => {
    return state.auth.authRedirectPath;
  });
  const playerState: Tuple = useSelector((state: RootState) => {
    return state.player.playerState;
  });

  const dispatch = useDispatch();

  const onTracksSearch = (type: string, term: string) => {
    if (token) {
      dispatch(actions.searchTracks(token, type, term));
    } else {
      setRedirect(true);
    }
  };
  const onPlaylistSave = (name: string, trackURIs: Array<string>) => {
    if (token) {
      dispatch(actions.savePlaylist(token, name, trackURIs));
    } else {
      setRedirect(true);
    }
  };

  const onPlay = () => dispatch(actions.playTrackStart(playerState));
  const onPause = () => dispatch(actions.playTrackPause(playerState));
  const onEnded = () => dispatch(actions.playTrackEnd());
  const onFail = (err: any) => dispatch(actions.playTrackFail(err));

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
    console.log(window.innerWidth);
  };

  const modal = (
    <Modal open={isModal} clicked={() => modalHandler(isModal)}>
      <Checkout
        cancel={() => modalHandler(isModal)}
        confirm={(val: string) => savePlaylistHandler(val)}
      />
    </Modal>
  );

  useEffect(() => {
    if (redirect) {
      window.location.assign(authRedirectPath);
    }
    //eslint-disable-next-line
  }, [redirect]);

  useEffect(() => {
    if (!authRedirectPath) {
      dispatch(actions.setAuthRedirectURL());
    }
  }, [authRedirectPath, dispatch]);

  const playerWidth: number =
    window.innerWidth > 1280
      ? 640
      : window.innerWidth <= 1280 && window.innerWidth > 640
      ? 0.5 * window.innerWidth
      : window.innerWidth;

  let player = null;

  if (playerState) {
    player = (
      <ReactPlayer
        className={classes.Player}
        url={
          playerState[2]
            ? list[playerState[0]].preview_url
            : results[playerState[0]].preview_url
        }
        playing={playerState[1]}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={(err: any) => onFail(err)}
        controls
        volume={0.1}
        width={playerWidth}
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />
    );
  }

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
          <div className={classes.PlayerWrapper}>{player}</div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  ) : (
    <Spinner />
  );
};

export default errorHandler(PlaylistMaker, axios);
