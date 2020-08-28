import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";

import classes from "./PlaylistMaker.module.scss";
import SearchBar from "./SearchBar/SearchBar";
import Playlist from "./Playlist/Playlist";
import SearchResults from "./SearchResults/SearchResults";
import Player from "./Player/Player";
import Spinner from "./../../components/UI/Spinner/Spinner";
import Modal from "./../../components/UI/Modal/Modal";
import Checkout from "../../components/Playlist/Checkout/Checkout";
import { Track, Tracklist, Tuple, authPopup } from "./../../shared/utility";
import { RootState } from "../../index";
import errorHandler from "./../../Hoc/errorHandler/errorHandler";
import axios from "./../../axios-spotify";
import * as actions from "./../../store/actions/index";
import Button from "../../components/UI/Button/Button";

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
  const saveResult: boolean = useSelector((state: RootState) => {
    return state.playlistMaker.saveResult;
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

  const onTracksSearch = useCallback(
    (type: string, term: string) => {
      dispatch(actions.searchTracks(token, type, term));
    },
    [dispatch, token]
  );
  const onPlaylistSave = useCallback(
    (name: string, trackURIs: Array<string>) => {
      dispatch(actions.savePlaylist(token, name, trackURIs));
    },
    [dispatch, token]
  );
  const onSuccessConfirm = useCallback(() => {
    dispatch(actions.successConfirm());
  }, [dispatch]);

  const modalHandler = (prevState: boolean) => {
    setModal(!prevState);
  };
  const confirmModalHandler = useCallback(
    (prevState: boolean) => {
      onSuccessConfirm();
      setModal(!prevState);
    },
    [onSuccessConfirm]
  );

  const savePlaylistHandler = useCallback(
    (val: string) => {
      const trackURIs: Array<string> = [];
      list.map((track: Track) => trackURIs.push(track.uri));
      if (token) {
        onPlaylistSave(val, trackURIs);
      } else {
        setRedirect(true);
      }
    },
    [token, list, onPlaylistSave]
  );
  const searchHandler = useCallback(
    (type: string, term: string) => {
      if (token) {
        onTracksSearch(type, term);
      } else {
        setRedirect(true);
      }
    },
    [onTracksSearch, token, setRedirect]
  );

  useEffect(() => {
    if (redirect) {
      // window.location.assign(authRedirectPath);
      const window = authPopup(authRedirectPath);
      window?.addEventListener("beforeunload", () => {
        dispatch(actions.authCheckState());
      });
    }
    //eslint-disable-next-line
  }, [redirect]);

  useEffect(() => {
    if (!authRedirectPath) {
      dispatch(actions.setAuthRedirectURL());
    }
  }, [authRedirectPath, dispatch]);

  useEffect(() => {
    return () => {
      if (saveResult) {
        onSuccessConfirm();
      }
    };
  });

  const modal = useMemo(
    () =>
      saveResult ? (
        <Modal open={isModal} clicked={() => confirmModalHandler(isModal)}>
          <div>
            <p style={{ color: "green" }}>Playlist Save Succesful!</p>
            <Button
              btnType="Confirm"
              clicked={() => confirmModalHandler(isModal)}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal open={isModal} clicked={() => modalHandler(isModal)}>
          <Checkout
            cancel={() => modalHandler(isModal)}
            confirm={(val: string) => savePlaylistHandler(val)}
          />
        </Modal>
      ),
    //eslint-disable-next-line
    [isModal, saveResult]
  );

  const searchBar = useMemo(
    () => (
      <div className={classes.SearchBar}>
        <SearchBar clicked={(val: string) => searchHandler("track", val)} />
      </div>
    ),
    [searchHandler]
  );

  const searchResults = useMemo(() => <SearchResults tracklist={results} />, [
    results,
  ]);

  const playlist = useMemo(
    () => <Playlist tracklist={list} clicked={() => modalHandler(isModal)} />,
    //eslint-disable-next-line
    [list]
  );

  const player = useMemo(
    () =>
      playerState && (
        <Player
          url={
            playerState[2]
              ? list[playerState[0]].preview_url
              : results[playerState[0]].preview_url
          }
          playerState={playerState}
        />
      ),
    [results, list, playerState]
  );

  return !error && !loading ? (
    <div className={classes.PlaylistMaker}>
      {modal}
      {searchBar}
      <div className={classes.Playlist}>
        {searchResults}
        {playlist}
        {player}
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

export default errorHandler(PlaylistMaker, axios);
