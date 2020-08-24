import React, { FunctionComponent } from "react";
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
  const playerState: Tuple = useSelector((state: RootState) => {
    return state.player.playerState;
  });

  const dispatch = useDispatch();
  const onPlayTrack = (id: number) => {
    let newPlayerState: Tuple = [id, true, isPlaylist];
    if (playerState) {
      // newPlayerState = [id, playerState[0] !== id ? true : false, isPlaylist];
      if (playerState[0] === id) {
        dispatch(actions.playTrackPause(playerState));
      } else {
        dispatch(actions.playTrackStart(newPlayerState));
      }
    } else {
      dispatch(actions.playTrackStart(newPlayerState));
    }
  };
  let onClickCallback = (id: number) => dispatch(actions.addTrack(id));
  let clickSign = "+";
  if (isPlaylist) {
    onClickCallback = (id: number) => dispatch(actions.deleteTrack(id));
    clickSign = "-";
  }
  const tracks = tracklist.map((track, id) => (
    <Track
      key={id}
      index={id}
      track={track}
      clicked={() => onClickCallback(id)}
      played={() => onPlayTrack(id)}
      playerState={playerState && playerState[0] === id ? playerState : null}
      isPlaylist={isPlaylist}
    >
      {clickSign}
    </Track>
  ));
  return <div className={classes.TrackList}>{tracks}</div>;
};

export default TrackList;
