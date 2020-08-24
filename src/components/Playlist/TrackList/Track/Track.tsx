import React, { FunctionComponent } from "react";

import classes from "./Track.module.scss";
import { Track as TrackData, Tuple } from "../../../../shared/utility";

type Props = {
  index: number;
  track: TrackData;
  clicked: () => void;
  playerState: Tuple | null;
  played: () => void;
  isPlaylist: boolean;
  children: any;
};
const Track: FunctionComponent<Props> = ({
  index,
  track,
  clicked,
  playerState,
  played,
  isPlaylist,
  children,
}) => {
  let playClasses = classes.PlayButton;
  let buttonClasses = [classes.Action, classes.Add].join(" ");
  if (playerState && playerState[1]) {
    playClasses = [classes.PlayButton, classes.Paused].join(" ");
  }
  if (isPlaylist) {
    buttonClasses = [classes.Action, classes.Remove].join(" ");
  }

  return (
    <div className={classes.Track}>
      <button className={playClasses} onClick={played} />
      <div className={classes.Information} onClick={played}>
        <h3>
          {index + 1}. {track.name}
        </h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
      <button className={buttonClasses} onClick={clicked}>
        {children}
      </button>
    </div>
  );
};

export default Track;
