import React from 'react';

import classes from './SearchResults.module.scss';
import TrackList from '../../../components/Playlist/TrackList/Tracklist';
import { Tracklist } from '../../../shared/utility';

type Props = {
  tracklist: Tracklist;
};

const SearchResults: React.FC<Props> = ({ tracklist }) => {
  return (
    <div className={classes.SearchResults}>
      <h1>Search Results</h1>
      <TrackList tracklist={tracklist} listType="searchResults" />
    </div>
  );
};

export default SearchResults;
