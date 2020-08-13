import React, { FunctionComponent } from "react";

import classes from "./Playlist.module.scss";
import Button from "../../../components/UI/Button/Button";
import TrackList from "../../../components/Playlist/TrackList/Tracklist";

type Props = {
  tracklist: Array<{
    title: string;
    artist: string;
    album?: string;
    year?: string;
    length?: string;
  }>;
  clicked: any;
};
const Playlist: FunctionComponent<Props> = ({ tracklist, clicked }) => {
  return (
    <div className={classes.Playlist}>
      <h1>New Playlist</h1>
      <TrackList tracklist={tracklist} isPlaylist />
      <div className={classes.Save}>
        <Button
          btnType="Save"
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
