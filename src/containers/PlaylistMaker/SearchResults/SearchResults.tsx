import React, { FunctionComponent } from 'react';

import classes from './SearchResults.module.scss';
import TrackList from '../../../components/Playlist/TrackList/Tracklist';
import { Tracklist } from '../../../shared/utility';

type Props = {
  tracklist: Tracklist;
};

const SearchResults: FunctionComponent<Props> = ({ tracklist }) => {
  return (
    <div className={classes.SearchResults}>
      <h1>Search Results</h1>
      <TrackList tracklist={tracklist} listType="searchResults" />
    </div>
  );
};

export default SearchResults;
