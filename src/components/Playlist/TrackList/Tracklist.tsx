import React, { FunctionComponent, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";

import * as actions from "../../../store/actions/index";
import classes from "./TrackList.module.scss";
import Track from "./Track/Track";
import { Tracklist, Tuple } from "../../../shared/utility";
import { RootState } from "../../..";

type Props = {
  tracklist: Tracklist;
  isPlaylist: boolean;
};

const TrackList: FunctionComponent<Props> = ({ tracklist, isPlaylist }) => {
  const playerState: Tuple | null = useSelector((state: RootState) => {
    return state.player.playerState;
  });

  const droppableId: [number, string] = !isPlaylist
    ? [0, "searchResults"]
    : [1, "playlist"];

  const dispatch = useDispatch();

  const onPlayTrack = useCallback(
    (id: number) => {
      let newPlayerState: Tuple = [id, true, isPlaylist];
      if (playerState && playerState[0] === id) {
        dispatch(
          actions.playTrackStateUpdate([
            playerState[0],
            !playerState[1],
            playerState[2],
          ])
        );
      } else {
        dispatch(actions.playTrackStateUpdate(newPlayerState));
      }
    },
    [dispatch, playerState, isPlaylist]
  );

  const onAddTrack = useCallback(
    (index: number) => dispatch(actions.addTrack(index)),
    [dispatch]
  );
  const onDeleteTrack = useCallback(
    (index: number) => dispatch(actions.deleteTrack(index)),
    [dispatch]
  );

  const onClickCallback = isPlaylist ? onDeleteTrack : onAddTrack;

  return (
    <Droppable key={droppableId[0]} droppableId={droppableId[1]}>
      {(provided) => (
        <div
          className={classes.TrackList}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {tracklist.map((track, index) => (
            <Draggable
              key={`${track.id}`}
              draggableId={`${track.id}`}
              index={index}
            >
              {(provided) => (
                <Track
                  index={index}
                  track={track}
                  clicked={() => onClickCallback(index)}
                  played={() => onPlayTrack(index)}
                  playerState={
                    playerState &&
                    playerState[0] === index &&
                    playerState[2] === isPlaylist
                      ? playerState
                      : null
                  }
                  isPlaylist={isPlaylist}
                  innerRef={provided.innerRef}
                  provided={provided}
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
