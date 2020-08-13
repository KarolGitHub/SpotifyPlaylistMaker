import React, { FunctionComponent } from "react";

import classes from "./Track.module.scss";

type Props = {
  trackData: {
    title: string;
    artist: string;
    album?: string;
    year?: string;
    length?: string;
  };
  clicked: () => void;
  children: any;
};
const Track: FunctionComponent<Props> = ({ trackData, clicked, children }) => {
  return (
    <div className={classes.Track}>
      <div className={classes.Information}>
        <h3>{trackData.title}</h3>
        <p>
          {trackData.artist}
          {trackData.album && " |" + trackData.album}
          {trackData.year && " |" + trackData.year}
          {trackData.length && " |" + trackData.length}
        </p>
      </div>
      <button className={classes.Action} onClick={clicked}>
        {children}
      </button>
    </div>
  );
};

export default Track;
