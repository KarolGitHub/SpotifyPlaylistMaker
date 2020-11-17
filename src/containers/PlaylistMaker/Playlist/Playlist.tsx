import React, { FunctionComponent } from "react";

import classes from "./Playlist.module.scss";
import Button from "../../../components/UI/Button/Button";
import TrackList from "../../../components/Playlist/TrackList/Tracklist";
import { Tracklist } from "../../../shared/utility";

type Props = {
  tracklist: Tracklist;
  name: string | null;
  clicked: any;
};
const Playlist: FunctionComponent<Props> = ({ tracklist, name, clicked }) => {
  return (
    <div className={classes.Playlist}>
      <h1>{name ? name : "New Playlist"}</h1>
      <TrackList tracklist={tracklist} listType="playlist" />
      <div className={classes.Save}>
        <Button
          btnType="purple"
          clicked={clicked}
          disabled={tracklist.length < 1}
        >
          Save To Spotify
        </Button>
      </div>
    </div>
  );
};

export default Playlist;
