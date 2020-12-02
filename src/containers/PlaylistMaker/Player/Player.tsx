import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';

import classes from './Player.module.scss';
import { Tuple } from '../../../shared/utility';
import { RootState } from '../../../index';
import * as actions from '../../../store/actions/index';
import Modal from '../../../components/UI/Modal/Modal';

type Props = {
  url: string;
  playerState: Tuple;
};

const Player: React.FC<Props> = ({ url, playerState }) => {
  const [volume, setVolume] = useState(false);
  const timerRef = useRef<any>(null);

  const error: any = useSelector((state: RootState) => {
    return state.player.error;
  });

  const dispatch = useDispatch();

  const playHandler = useCallback(
    () => dispatch(actions.playTrackStart(playerState)),
    [dispatch, playerState]
  );
  const pauseHandler = useCallback(() => {
    timerRef.current = setTimeout(
      () => dispatch(actions.playTrackPause(playerState)),
      10
    );
  }, [dispatch, playerState]);
  const seekHandler = () => {
    clearTimeout(timerRef.current);
  };
  const endedHandler = useCallback(() => dispatch(actions.playTrackEnd()), [
    dispatch,
  ]);
  const failHandler = useCallback(
    (err: { target: { error: { message: string } } } | null) => {
      dispatch(actions.playTrackFail(err?.target?.error?.message));
    },
    [dispatch]
  );

  useEffect(() => () => clearTimeout(timerRef.current));

  const playerWidth: number =
    window.innerWidth > 1280
      ? 640
      : window.innerWidth <= 1280 && window.innerWidth > 640
      ? 0.5 * window.innerWidth
      : window.innerWidth;
  return (
    <React.Fragment>
      <Modal open={error} clicked={() => failHandler(null)} invisible>
        {error ? error : null}
      </Modal>
      <div className={classes.PlayerWrapper}>
        <ReactPlayer
          className={classes.Player}
          url={url}
          playing={playerState[1]}
          onStart={() => setVolume(true)}
          onPlay={playHandler}
          onPause={pauseHandler}
          onSeek={seekHandler}
          onEnded={endedHandler}
          onError={(err: any) => failHandler(err)}
          controls
          volume={volume ? undefined : 0.1}
          width={playerWidth}
          config={{
            file: {
              forceAudio: true,
            },
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default Player;
