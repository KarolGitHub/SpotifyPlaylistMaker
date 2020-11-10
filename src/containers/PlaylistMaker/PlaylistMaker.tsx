import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

import classes from "./PlaylistMaker.module.scss";
import SearchBar from "./SearchBar/SearchBar";
import Playlist from "./Playlist/Playlist";
import SearchResults from "./SearchResults/SearchResults";
import Spinner from "./../../components/UI/Spinner/Spinner";
import Modal from "./../../components/UI/Modal/Modal";
import Checkout from "../../components/Playlist/Checkout/Checkout";
import {
  Track,
  Tracklist,
  Tuple,
  authPopup,
  PlaylistPayload,
  PlaylistInfo,
  moveItems,
  reorderItems,
} from "./../../shared/utility";
import { RootState } from "../../index";
import errorHandler from "./../../Hoc/errorHandler/errorHandler";
import axios from "./../../axios-spotify";
import * as actions from "./../../store/actions/index";
import Button from "../../components/UI/Button/Button";

const Player = lazy(() => {
  return import("./Player/Player");
});

const PlaylistMaker: FunctionComponent = () => {
  const [isModal, setModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const tracks: Tracklist = useSelector((state: RootState) => {
    return state.playlistMaker.playlist;
  });
  const results: Tracklist = useSelector((state: RootState) => {
    return state.playlistMaker.searchResults;
  });
  const searchResultsLimit: number = useSelector((state: RootState) => {
    return state.playlistMaker.searchResultsLimit;
  });
  const loading: boolean = useSelector((state: RootState) => {
    return state.playlistMaker.loading;
  });
  const error: any = useSelector((state: RootState) => {
    return state.playlistMaker.error;
  });
  const saveResult: boolean = useSelector((state: RootState) => {
    return state.playlistMaker.saveResult;
  });
  const token: string = useSelector((state: RootState) => {
    return state.auth.token;
  });
  const userId: string = useSelector((state: RootState) => {
    return state.auth.userId;
  });
  const country: string = useSelector((state: RootState) => {
    return state.auth.country;
  });
  const authRedirectPath: string = useSelector((state: RootState) => {
    return state.auth.authRedirectPath;
  });
  const playerState: Tuple = useSelector((state: RootState) => {
    return state.player.playerState;
  });
  const playlistInfo: PlaylistInfo | null = useSelector((state: RootState) => {
    return state.playlists.playlistInfo;
  });

  const dispatch = useDispatch();

  const onTracksSearch = useCallback(
    (type: string, term: string, limit: number) =>
      dispatch(actions.searchTracks(token, country, type, term, limit)),
    [dispatch, token, country]
  );
  const onPlaylistSave = useCallback(
    (payload: PlaylistPayload, trackURIs: Array<string>) =>
      dispatch(actions.savePlaylist(token, userId, payload, trackURIs)),
    [dispatch, token, userId]
  );
  const onSuccessConfirm = useCallback(
    () => dispatch(actions.successConfirm()),
    [dispatch]
  );
  const onClearPlaylist = useCallback(() => dispatch(actions.clearPlaylist()), [
    dispatch,
  ]);
  const onEditPlaylist = useCallback(
    (payload, trackURIs, changedDetails) =>
      dispatch(
        actions.editPlaylist(
          token,
          userId,
          payload,
          trackURIs,
          changedDetails,
          playlistInfo?.id
        )
      ),
    [dispatch, token, userId, playlistInfo]
  );
  const onSetTracks = useCallback(
    (tracklist: {}) => dispatch(actions.setTracks(tracklist)),
    [dispatch]
  );
  const onMoveTrack = useCallback(
    (tracklist: {}) => dispatch(actions.moveTrack(tracklist)),
    [dispatch]
  );

  const compareDetails = (
    userPayload: PlaylistPayload,
    playlistPayload: PlaylistPayload
  ) => [JSON.stringify(userPayload) !== JSON.stringify(playlistPayload)];

  const modalHandler = (prevState: boolean) => {
    setModal(!prevState);
  };

  const confirmModalHandler = useCallback(
    (prevState: boolean) => {
      onSuccessConfirm();
      setModal(!prevState);
      onClearPlaylist();
    },
    [onSuccessConfirm, onClearPlaylist]
  );

  const savePlaylistHandler = useCallback(
    (payload: PlaylistPayload) => {
      const trackURIs: Array<string> = [];
      tracks.map((track: Track) => trackURIs.push(track.uri));
      if (token) {
        if (playlistInfo) {
          const changedDetails = compareDetails(payload, playlistInfo.payload);
          onEditPlaylist(payload, trackURIs, changedDetails);
        } else {
          onPlaylistSave(payload, trackURIs);
        }
      } else {
        setRedirect(true);
      }
    },
    [token, tracks, onPlaylistSave, playlistInfo, onEditPlaylist]
  );
  const searchHandler = useCallback(
    (type: string, term: string, limit: number) => {
      if (token) {
        onTracksSearch(type, term, limit);
      } else {
        setRedirect(true);
      }
    },
    [onTracksSearch, token, setRedirect]
  );

  const dragEndHandler = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    const sourceItems = sInd === "playlist" ? tracks : results;
    if (sInd === dInd) {
      const updatedItems: {} = reorderItems(
        sourceItems,
        destination.index,
        source
      );
      onSetTracks(updatedItems);
    } else {
      const destinationItems = dInd === "playlist" ? tracks : results;
      const updatedItems: {} = moveItems(
        sourceItems,
        destinationItems,
        source,
        destination
      );
      onMoveTrack(updatedItems);
    }
  };

  useEffect(() => {
    if (redirect) {
      window.addEventListener("storage", () => {
        const storage = window.localStorage.getItem("token");
        if (storage !== null) {
          dispatch(actions.authCheckState());
          window.removeEventListener("storage", () => {});
        }
      });
      authPopup(authRedirectPath);
    }
  }, [dispatch, redirect, authRedirectPath]);
  useEffect(() => {
    if (!authRedirectPath) {
      dispatch(actions.setAuthRedirectURL());
    }
  }, [authRedirectPath, dispatch]);
  useEffect(
    () => () => {
      if (saveResult) {
        onSuccessConfirm();
        setModal(false);
      }
    },
    [saveResult, onSuccessConfirm]
  );
  useEffect(
    () => () => {
      if (playlistInfo) {
        onClearPlaylist();
        onSetTracks({ playlist: [] });
      }
    }, //eslint-disable-next-line
    [playlistInfo]
  );

  const modal = useMemo(
    () =>
      saveResult ? (
        <Modal open={isModal} clicked={() => confirmModalHandler(isModal)}>
          <div>
            <p style={{ color: "green" }}>Playlist Save Succesful!</p>
            <Button
              btnType="green"
              clicked={() => confirmModalHandler(isModal)}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal open={isModal} clicked={() => modalHandler(isModal)}>
          <Checkout
            playlistInfo={playlistInfo ? playlistInfo.payload : null}
            cancel={() => modalHandler(isModal)}
            confirm={(payload: PlaylistPayload) => savePlaylistHandler(payload)}
          />
        </Modal>
      ),
    [
      isModal,
      saveResult,
      confirmModalHandler,
      playlistInfo,
      savePlaylistHandler,
    ]
  );

  const searchBar = useMemo(
    () => (
      <div className={classes.SearchBar}>
        <SearchBar
          clicked={(val: string, limit: number) =>
            searchHandler("track", val, limit)
          }
          limit={searchResultsLimit}
        />
      </div>
    ),
    [searchHandler, searchResultsLimit]
  );

  const searchResults = useMemo(() => <SearchResults tracklist={results} />, [
    results,
  ]);

  const playlist = useMemo(
    () => (
      <Playlist
        tracklist={tracks}
        name={playlistInfo ? playlistInfo.payload.name : null}
        clicked={() => modalHandler(isModal)}
      />
    ), //eslint-disable-next-line
    [tracks, playlistInfo]
  );

  const player = useMemo(
    () =>
      playerState && (
        <Player
          url={
            playerState[2]
              ? tracks[playerState[0]]?.preview_url
              : results[playerState[0]]?.preview_url
          }
          playerState={playerState}
        />
      ),
    [results, tracks, playerState]
  );

  return !error ? (
    !loading ? (
      <div className={classes.PlaylistMaker}>
        {modal}
        {searchBar}
        <div className={classes.Playlist}>
          <DragDropContext onDragEnd={dragEndHandler}>
            {searchResults}
            {playlist}
          </DragDropContext>
          {player}
        </div>
      </div>
    ) : (
      <Spinner />
    )
  ) : (
    <p>{error + ""}</p>
  );
};

export default errorHandler(PlaylistMaker, axios);
