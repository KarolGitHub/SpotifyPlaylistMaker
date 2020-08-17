import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../../../store/actions/index";
import classes from "./TrackList.module.scss";
import Track from "./Track/Track";
import { Tracklist } from "../../../shared/utility";

type Props = {
  tracklist: Tracklist;
  isPlaylist?: boolean;
};

const TrackList: FunctionComponent<Props> = ({ tracklist, isPlaylist }) => {
  const dispatch = useDispatch();
  let onClickCallback = (id: number) => dispatch(actions.addTrack(id));
  let clickSign = "+";
  if (isPlaylist) {
    onClickCallback = (id: number) => dispatch(actions.deleteTrack(id));
    clickSign = "-";
  }
  const tracks = tracklist.map((track, id) => (
    <Track key={id} track={track} clicked={() => onClickCallback(id)}>
      {clickSign}
    </Track>
  ));
  return <div className={classes.TrackList}>{tracks}</div>;
};

export default TrackList;
