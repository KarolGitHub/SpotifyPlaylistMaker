import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import * as actions from '../../../store/actions/index';
import classes from './TrackList.module.scss';
import Track from './Track/Track';
import { Tracklist, Tuple } from '../../../shared/utility';
import { RootState } from '../../..';

type Props = {
  tracklist?: Tracklist;
  listType: 'playlist' | 'searchResults';
};

const applyListStyleOnDrag = (isDraggingOver: boolean) => ({
  boxShadow: isDraggingOver
    ? 'inset 0 0 10px var(--listShadow), 0 0 10px var(--listShadow)'
    : 'none',
});
const applyTrackStyleOnDrag = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  opacity: isDragging ? '0.5' : '1',
  ...draggableStyle,
});

const TrackList: React.FC<Props> = ({ tracklist, listType }) => {
  const playerState: Tuple | null | false = useSelector((state: RootState) => {
    return state.player.playerState;
  });

  const droppableKey: number = listType === 'playlist' ? 1 : 0;

  const dispatch = useDispatch();

  const isTrackPlayed = useCallback(
    (index: number, playerState: Tuple) =>
      playerState[0] === index && playerState[2] === listType
        ? playerState
        : null,
    [listType]
  );

  const updatePlayTrackIndex = useCallback(
    (index: number, playerState: Tuple) => {
      if (playerState[2] === listType) {
        if (playerState[0] === index) {
          dispatch(actions.playTrackEnd());
        } else if (playerState[0] > index) {
          dispatch(
            actions.playTrackStateUpdate([
              playerState[0] - 1,
              playerState[1],
              listType,
            ])
          );
        }
      }
    },
    [listType, dispatch]
  );

  const onPlayTrack = useCallback(
    (id: number) => {
      let newPlayerState: Tuple = [id, true, listType];
      if (playerState && playerState[0] === id && playerState[2] === listType) {
        dispatch(
          actions.playTrackStateUpdate([
            playerState[0],
            !playerState[1],
            listType,
          ])
        );
      } else {
        dispatch(actions.playTrackStateUpdate(newPlayerState));
      }
    },
    [dispatch, playerState, listType]
  );

  const onAddTrack = useCallback(
    (index: number) => {
      dispatch(actions.addTrack(index));
      if (playerState) {
        updatePlayTrackIndex(index, playerState);
      }
    },
    [dispatch, playerState, updatePlayTrackIndex]
  );
  const onDeleteTrack = useCallback(
    (index: number) => {
      dispatch(actions.deleteTrack(index));
      if (playerState) {
        updatePlayTrackIndex(index, playerState);
      }
    },
    [dispatch, playerState, updatePlayTrackIndex]
  );

  const onClickCallback = listType === 'playlist' ? onDeleteTrack : onAddTrack;

  return (
    <Droppable key={droppableKey} droppableId={listType}>
      {(provided, snapshot) => (
        <div
          className={classes.TrackList}
          ref={provided.innerRef}
          style={applyListStyleOnDrag(snapshot.isDraggingOver)}
          {...provided.droppableProps}
        >
          {tracklist?.map((track, index) => (
            <Draggable
              key={`${track.id}${index}`}
              draggableId={`${track.id}${index}`}
              index={index}
            >
              {(provided, snapshot) => (
                <Track
                  index={index}
                  track={track}
                  clicked={() => onClickCallback(index)}
                  played={() => onPlayTrack(index)}
                  playerState={
                    playerState
                      ? isTrackPlayed(index, playerState)
                      : playerState
                  }
                  isPlaylist={listType === 'playlist'}
                  innerRef={provided.innerRef}
                  provided={provided}
                  style={applyTrackStyleOnDrag(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TrackList;
