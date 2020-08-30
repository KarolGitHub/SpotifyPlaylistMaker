import React, { FunctionComponent, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../../store/actions/index";
import classes from "./TrackList.module.scss";
import Track from "./Track/Track";
import { Tracklist, Tuple } from "../../../shared/utility";
import { RootState } from "../../..";

type Props = {
  tracklist: Tracklist;
  isPlaylist: boolean;
};

const TrackList: FunctionComponent<Props> = ({ tracklist, isPlaylist }) => {
  const playerState: Tuple | null = useSelector((state: RootState) => {
    return state.player.playerState;
  });
  const addedTrackIDs: Array<string> = useSelector((state: RootState) => {
    return !isPlaylist ? state.playlistMaker.addedTrackIDs : null;
  });

  const dispatch = useDispatch();

  const onPlayTrack = useCallback(
    (id: number) => {
      let newPlayerState: Tuple = [id, true, isPlaylist];
      if (playerState && playerState[0] === id) {
        dispatch(
          actions.playTrackStateUpdate([
            playerState[0],
            !playerState[1],
            playerState[2],
          ])
        );
      } else {
        dispatch(actions.playTrackStateUpdate(newPlayerState));
      }
    },
    [dispatch, playerState, isPlaylist]
  );

  const onAddTrack = useCallback(
    (index: number, id: string) => dispatch(actions.addTrack(index, id)),
    [dispatch]
  );
  const onDeleteTrack = useCallback(
    (index: number, id: string) => dispatch(actions.deleteTrack(index, id)),
    [dispatch]
  );

  const onCLickCallback = isPlaylist ? onDeleteTrack : onAddTrack;

  const tracks = tracklist.map((track, index) => {
    const isInPlaylist = addedTrackIDs
      ? addedTrackIDs.findIndex((id) => id === track.id) !== -1
        ? true
        : false
      : null;
    return (
      <Track
        key={index}
        index={index}
        track={track}
        clicked={(id: string) => onCLickCallback(index, id)}
        played={() => onPlayTrack(index)}
        playerState={
          playerState &&
          playerState[0] === index &&
          playerState[2] === isPlaylist
            ? playerState
            : null
        }
        isInPlaylist={isInPlaylist}
      />
    );
  });
  return <div className={classes.TrackList}>{tracks}</div>;
};

export default TrackList;
