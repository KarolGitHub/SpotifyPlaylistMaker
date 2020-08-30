import React, { FunctionComponent, useRef } from "react";

import classes from "./Track.module.scss";
import { Track as TrackData, Tuple } from "../../../../shared/utility";

type Props = {
  index: number;
  track: TrackData;
  clicked: (id: string) => void;
  playerState: Tuple | null;
  played: () => void;
  isInPlaylist: boolean | null;
};
const Track: FunctionComponent<Props> = ({
  index,
  track,
  clicked,
  playerState,
  played,
  isInPlaylist,
}) => {
  let btnRef: any = useRef();

  let btnClass = [classes.Action, classes.Remove].join(" "),
    disabled = false,
    children = "-";
  if (isInPlaylist) {
    btnClass = [classes.Action, classes.Check].join(" ");
    disabled = true;
    children = String.fromCharCode(10004);
  } else if (isInPlaylist === false) {
    btnClass = [classes.Action, classes.Add].join(" ");
    children = "+";
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
      <button
        ref={btnRef}
        className={btnClass}
        disabled={disabled}
        onClick={() => clicked(track.id)}
      >
        {children}
      </button>
    </div>
  );
};

export default React.memo(Track);
