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
  let buttonClasses = [classes.Action, classes.Add].join(" ");

  if (isPlaylist) {
    buttonClasses = [classes.Action, classes.Remove].join(" ");
  }

  let infoClasses = classes.Information;
  let information = (
    <div className={infoClasses}>
      <h3>
        {index + 1}. {track.name}
      </h3>
      <p>
        {track.artist} | {track.album}
      </p>
    </div>
  );

  let playButton = null;

  if (track.preview_url) {
    let playClasses = classes.PlayButton;
    if (playerState && playerState[1]) {
      playClasses = [classes.PlayButton, classes.Paused].join(" ");
    }
    playButton = <button className={playClasses} onClick={played} />;
    infoClasses = [classes.Information, classes.Playable].join(" ");
    information = (
      <div className={infoClasses} onClick={played}>
        <h3>
          {index + 1}. {track.name}
        </h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
    );
  }

  return (
    <div className={classes.Track}>
      {playButton}
      {information}
      <button className={buttonClasses} onClick={clicked}>
        {children}
      </button>
    </div>
  );
};

export default React.memo(Track);
