import React, { FunctionComponent } from "react";

import classes from "./SearchResults.module.scss";
import TrackList from "../../../components/Playlist/TrackList/Tracklist";

type Props = {
  tracklist: Array<{
    title: string;
    artist: string;
    album?: string;
    year?: string;
    length?: string;
  }>;
};

const SearchResults: FunctionComponent<Props> = ({ tracklist }) => {
  return (
    <div className={classes.SearchResults}>
      <h1>Search Results</h1>
      <TrackList tracklist={tracklist} />
    </div>
  );
};

export default SearchResults;
