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
    (id: number) => dispatch(actions.addTrack(id)),
    [dispatch]
  );
  const onDeleteTrack = useCallback(
    (id: number) => dispatch(actions.deleteTrack(id)),
    [dispatch]
  );

  const clickSign = isPlaylist ? "-" : "+";
  const onCLickCallback = isPlaylist ? onDeleteTrack : onAddTrack;

  const tracks = tracklist.map((track, id) => (
    <Track
      key={id}
      index={id}
      track={track}
      clicked={() => onCLickCallback(id)}
      played={() => onPlayTrack(id)}
      playerState={
        playerState && playerState[0] === id && playerState[2] === isPlaylist
          ? playerState
          : null
      }
      isPlaylist={isPlaylist}
    >
      {clickSign}
    </Track>
  ));
  return <div className={classes.TrackList}>{tracks}</div>;
};

export default TrackList;
