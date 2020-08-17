import React, { FunctionComponent } from "react";

import classes from "./Track.module.scss";
import { Track as TrackData } from "../../../../shared/utility";

type Props = {
  track: TrackData;
  clicked: () => void;
  children: any;
};
const Track: FunctionComponent<Props> = ({ track, clicked, children }) => {
  return (
    <div className={classes.Track}>
      <div className={classes.Information}>
        <h3>{track.name}</h3>
        <p>
          {track.artist + " | "}
          {track.album}
        </p>
      </div>
      <button className={classes.Action} onClick={clicked}>
        {children}
      </button>
    </div>
  );
};

export default Track;
