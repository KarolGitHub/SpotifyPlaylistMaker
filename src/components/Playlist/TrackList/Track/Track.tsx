import React, {
  FunctionComponent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import classes from "./Track.module.scss";
import { Track as TrackData, Tuple } from "../../../../shared/utility";

const isElementOverflowing = (element: any) => {
  return element?.offsetWidth < element?.scrollWidth;
};

const applyMarqueeOnOverflow = (overflowingElement: any) => {
  overflowingElement.style.setProperty(
    "--animation-time",
    `calc((5.5s*${overflowingElement.scrollWidth})/622)`
  );
  overflowingElement.style.setProperty(
    "--gap-width",
    `calc(62px/${622 / overflowingElement.scrollWidth})`
  );
};
const applyMarqueeOnTrackPlay = (overflowingElement: any) => {
  overflowingElement.style.setProperty("--animation-play-state", "running");
};
const applyMarqueeOnTrackEnd = (overflowingElement: any) => {
  overflowingElement.style.setProperty("--animation-play-state", "initial");
};

type Props = {
  index: number;
  track: TrackData;
  clicked: () => void;
  playerState: Tuple | null | false;
  played: () => void;
  isPlaylist: boolean;
  innerRef: any;
  provided: any;
  style: any;
};
const Track: FunctionComponent<Props> = ({
  index,
  track,
  clicked,
  playerState,
  played,
  isPlaylist,
  innerRef,
  provided,
  style,
}) => {
  const [trackClasses, setTrackClasses] = useState(classes.Track);
  const trackDescRef: any = useRef([]);

  let btnClass = `${classes.Action} ${classes.Remove}`,
    actionIndicator = "-",
    trackDescClasses = classes.Description,
    onPlayCallback = undefined,
    playButton = null;

  if (!isPlaylist) {
    btnClass = `${classes.Action} ${classes.Add}`;
    actionIndicator = "+";
  }

  if (track.preview_url) {
    trackDescClasses = `${trackDescClasses} ${classes.Playable}`;
    onPlayCallback = played;

    let playClasses = classes.PlayButton,
      overlayClasses = classes.Overlay;

    if (playerState) {
      if (playerState[1]) {
        playClasses = `${playClasses} ${classes.Paused}`;
        overlayClasses = `${overlayClasses} ${classes.Paused}`;
      }
      if (isElementOverflowing(trackDescRef.current[0])) {
        applyMarqueeOnTrackPlay(trackDescRef.current[1]);
      }
    } else if (playerState === false) {
      if (isElementOverflowing(trackDescRef.current[0])) {
        applyMarqueeOnTrackEnd(trackDescRef.current[1]);
      }
    }

    playButton = (
      <div className={overlayClasses}>
        <button className={playClasses} onClick={onPlayCallback} />
      </div>
    );
  }

  useLayoutEffect(() => {
    if (isElementOverflowing(trackDescRef.current[0])) {
      applyMarqueeOnOverflow(trackDescRef.current[1]);
      setTrackClasses(`${trackClasses} ${classes.Marquee}`);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div
      className={trackClasses}
      ref={innerRef}
      style={style}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {playButton}
      <div
        className={trackDescClasses}
        onClick={onPlayCallback}
        ref={(el: any) => (trackDescRef.current[0] = el)}
      >
        <div
          className={classes.Text}
          ref={(el: any) => (trackDescRef.current[1] = el)}
        >
          <span>
            <h3>
              {index + 1}. {track.name}
            </h3>
            <p>
              {track.artist} | {track.album}
            </p>
          </span>
          {trackClasses !== classes.Track && (
            <span>
              <h3>
                {index + 1}. {track.name}
              </h3>
              <p>
                {track.artist} | {track.album}
              </p>
            </span>
          )}
        </div>
      </div>
      <button className={btnClass} onClick={clicked}>
        {actionIndicator}
      </button>
    </div>
  );
};

export default Track;
