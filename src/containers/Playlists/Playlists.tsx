import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  FunctionComponent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "../../axios-spotify";
import { RootState } from "../..";
import errorHandler from "./../../Hoc/errorHandler/errorHandler";
import * as actions from "../../store/actions/index";
import playlistsClasses from "./Playlists.module.scss";
import buttonClasses from "../../components/UI/Button/Button.module.scss";
import { PlaylistInfo, SpotifyPlaylist, Tracklist } from "../../shared/utility";
import ReactTable from "./ReactTable/ReactTable.js";
import { CellProps } from "./ReactTable/Filters/Filters";
import Modal from "./../../components/UI/Modal/Modal";
import Button from "../../components/UI/Button/Button";
import { Redirect } from "react-router-dom";

const Playlists: FunctionComponent = () => {
  const [isPlaylist, setPlaylist] = useState(false);
  const [isModal, setModal] = useState<string | null>(null);
  const [areAllChecked, setAreAllChecked] = useState(false);
  const [checked, setChecked] = useState<Array<string>>([]);

  const playlists: Array<SpotifyPlaylist> = useSelector((state: RootState) => {
    return state.playlists.playlists;
  });
  const tracks: Tracklist = useSelector((state: RootState) => {
    return state.playlists.tracks;
  });
  const loading: boolean = useSelector((state: RootState) => {
    return state.playlists.loading;
  });
  const redirect: boolean = useSelector((state: RootState) => {
    return state.playlists.redirect;
  });
  const playlistInfo: PlaylistInfo | null = useSelector((state: RootState) => {
    return state.playlists.playlistInfo;
  });
  const error: any = useSelector((state: RootState) => {
    return state.playlists.error;
  });
  const token: string = useSelector((state: RootState) => {
    return state.auth.token;
  });
  const userId: string = useSelector((state: RootState) => {
    return state.auth.userId;
  });

  const dispatch = useDispatch();

  const onFetchPlaylists = useCallback(
    () => dispatch(actions.fetchPlaylists(token, userId)),
    [dispatch, token, userId]
  );
  const onFetchTracks = useCallback(
    (playlistInfo: PlaylistInfo, redirect: boolean) =>
      dispatch(actions.fetchTracks(token, playlistInfo, redirect)),
    [dispatch, token]
  );
  const onDeleteTracks = useCallback(
    (deletedTracks: { tracks: { uri: string | null }[] }) => {
      Promise.all([
        dispatch(actions.deleteTracks(token, deletedTracks, playlistInfo?.id)),
        dispatch(
          actions.fetchTracks(
            token,
            playlistInfo
              ? playlistInfo
              : {
                  id: "",
                  payload: {
                    name: "",
                    public: true,
                    collaborative: false,
                    description: "",
                  },
                  uri: "",
                },
            false
          )
        ),
      ]);
    },
    [dispatch, token, playlistInfo]
  );
  const onSetTracks = useCallback(() => dispatch(actions.setTracks(tracks)), [
    dispatch,
    tracks,
  ]);
  const onSetRedirect = useCallback(() => dispatch(actions.setRedirect()), [
    dispatch,
  ]);

  useEffect(() => {
    if (playlists.length === 0) {
      onFetchPlaylists();
    }
  }, [playlists, onFetchPlaylists]);
  useEffect(() => {
    return () => {
      if (redirect) {
        onSetTracks();
        onSetRedirect();
      }
    };
  }, [redirect, onSetTracks, onSetRedirect]);

  const checkAllHandler = useCallback(() => {
    if (!areAllChecked) {
      let newChecked: any = [];
      tracks.map((track) => newChecked.push(track.uri));
      setChecked(newChecked);
    } else {
      setChecked([]);
    }
    setAreAllChecked(!areAllChecked);
  }, [areAllChecked, tracks]);
  const checkRowHandler = useCallback(
    (uri: string) => {
      const checkedIndex = checked.indexOf(uri);
      let newChecked: any = [];

      if (checkedIndex === -1) {
        newChecked = newChecked.concat(checked, uri);
      } else if (checkedIndex === 0) {
        newChecked = newChecked.concat(checked.slice(1));
      } else if (checkedIndex === checked.length - 1) {
        newChecked = newChecked.concat(checked.slice(0, -1));
      } else if (checkedIndex > 0) {
        newChecked = newChecked.concat(
          checked.slice(0, checkedIndex),
          checked.slice(checkedIndex + 1)
        );
      }
      setChecked(newChecked);
    },
    [checked]
  );

  const editPlaylistHandler = useCallback(
    (playlistInfo: PlaylistInfo) => {
      onFetchTracks(playlistInfo, true);
    },
    [onFetchTracks]
  );
  const showPlaylistHandler = useCallback(
    (playlistInfo: PlaylistInfo) => {
      setPlaylist(!isPlaylist);
      onFetchTracks(playlistInfo, false);
    },
    [onFetchTracks, isPlaylist]
  );
  const hidePlaylistHandler = () => {
    setChecked([]);
    setAreAllChecked(false);
    setPlaylist(!isPlaylist);
  };
  const modalHandler = useCallback((uri: string | null) => {
    setModal(uri);
  }, []);
  const confirmDeleteHandler = useCallback(
    (uri: string | null) => {
      const selectedTracks: { tracks: { uri: string | null }[] } = {
        tracks: [],
      };
      if (uri === " ") {
        Object.values(checked).map((checkedUri) =>
          selectedTracks.tracks.push({ uri: checkedUri })
        );
        setAreAllChecked(false);
        setChecked([]);
      } else {
        selectedTracks.tracks.push({ uri: uri });
      }
      setModal(null);
      onDeleteTracks(selectedTracks);
    },
    [checked, onDeleteTracks]
  );

  const checkedLength = useMemo(() => checked.length === 0, [checked]);
  const playlistsData = useMemo(() => playlists, [playlists]);
  const tracksData = useMemo(() => tracks, [tracks]);

  const playlistColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "payload.name",
        maxWidth: 600,
        minWidth: 100,
      },
      {
        Header: "Tracks",
        accessor: "tracks.total",
        maxWidth: 200,
        minWidth: 80,
        disableFilters: true,
      },
      {
        id: "show",
        maxWidth: 50,
        minWidth: 50,
        sortable: false,
        disableFilters: true,
        Cell: ({ row }: CellProps) => {
          return (
            <Button
              clicked={() =>
                showPlaylistHandler({
                  id: row.original.id,
                  payload: row.original.payload,
                  uri: row.original.tracks.href,
                })
              }
              btnType="green"
              table
            >
              Show
            </Button>
          );
        },
      },
      {
        id: "edit",
        maxWidth: 50,
        minWidth: 40,
        sortable: false,
        disableFilters: true,
        Cell: ({ row }: CellProps) => (
          <Button
            clicked={() =>
              editPlaylistHandler({
                id: row.original.id,
                payload: row.original.payload,
                uri: row.original.tracks.href,
              })
            }
            btnType="blue"
            table
          >
            Edit
          </Button>
        ),
      },
    ],
    [showPlaylistHandler, editPlaylistHandler]
  );

  const trackColumns = [
    useMemo(() => {
      return {
        Header: () => (
          <input
            type="checkbox"
            className={playlistsClasses.Checkbox}
            checked={areAllChecked}
            onChange={checkAllHandler}
          />
        ),
        id: "checkbox",
        maxWidth: 10,
        minWidth: 10,
        disableFilters: true,
        sortable: false,
        Cell: ({ row }: CellProps) => {
          return (
            <input
              type="checkbox"
              checked={checked.indexOf(row.original.uri) !== -1}
              onChange={() => checkRowHandler(row.original.uri)}
              className={playlistsClasses.Checkbox}
            />
          );
        },
      };
    }, [areAllChecked, checked, checkAllHandler, checkRowHandler]),
    useMemo(() => {
      return {
        Header: "Name",
        accessor: "name",
        maxWidth: 200,
        minWidth: 100,
      };
    }, []),
    useMemo(() => {
      return {
        Header: "Artist",
        accessor: "artist",
        maxWidth: 200,
        minWidth: 100,
      };
    }, []),
    useMemo(() => {
      return {
        Header: "Album",
        accessor: "album",
        maxWidth: 200,
        minWidth: 100,
      };
    }, []),
    {
      Header: useMemo(
        () => () => (
          <button
            onClick={() => modalHandler(" ")}
            className={[
              buttonClasses.Button,
              buttonClasses.Red,
              buttonClasses.DeleteAll,
            ].join(" ")}
            disabled={checkedLength}
          >
            Delete Selected
          </button>
        ),
        [checkedLength, modalHandler]
      ),
      id: "delete",
      maxWidth: 50,
      minWidth: 50,
      sortable: false,
      disableFilters: true,
      Cell: useMemo(
        () => ({ row }: CellProps) => (
          <Button
            clicked={() => modalHandler(row.original.uri)}
            btnType="red"
            table
          >
            Delete
          </Button>
        ),
        [modalHandler]
      ),
    },
  ];

  const modal = useMemo(
    () => (
      <Modal open={isModal ? true : false} clicked={() => modalHandler(null)}>
        <div>
          <p>Are you sure you want to delete selected tracks?</p>
          <div className={playlistsClasses.ModalButtons}>
            <Button btnType="cancel" clicked={() => modalHandler(null)}>
              Cancel
            </Button>
            <Button btnType="red" clicked={() => confirmDeleteHandler(isModal)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    ),
    [isModal, confirmDeleteHandler, modalHandler]
  );

  const table = isPlaylist ? (
    <div className={playlistsClasses.Tracks}>
      <button
        onClick={hidePlaylistHandler}
        className={[
          buttonClasses.Button,
          buttonClasses.Green,
          buttonClasses.Back,
        ].join(" ")}
      >
        Playlists
      </button>
      <h3>{playlistInfo?.payload.name}</h3>
      <ReactTable columns={trackColumns} data={tracksData} />
    </div>
  ) : (
    <ReactTable columns={playlistColumns} data={playlistsData} />
  );

  return !error ? (
    !loading ? (
      !redirect ? (
        <div className={playlistsClasses.Playlists}>
          {modal}
          {table}
        </div>
      ) : (
        <Redirect to="/" />
      )
    ) : (
      <Spinner />
    )
  ) : (
    <p>{error + ""}</p>
  );
};

export default errorHandler(Playlists, axios);
