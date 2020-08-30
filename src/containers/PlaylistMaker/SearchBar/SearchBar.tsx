import React, { FunctionComponent, useState, useRef, useMemo } from "react";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";

import { Handle, Track, TooltipRail } from "./SliderItems/SliderItems";
import classes from "./SearchBar.module.scss";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import { updateObject, isValid } from "../../../shared/utility";

type Props = {
  clicked: (val: string, limit: number) => void;
  limit: number;
};

const SearchBar: FunctionComponent<Props> = ({ clicked, limit }) => {
  const [input, setInput] = useState({
    value: "",
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
  });

  const searchResultsLimit = useRef(limit);

  const inputChangedHandler = (event: { target: HTMLInputElement }) => {
    const updatedInput = updateObject(input, {
      value: event.target.value,
      valid: isValid(event.target.value, input.validation),
      touched: true,
    });
    setInput(updatedInput);
  };

  const pressedHandler = (event: { keyCode: number }) => {
    if (event.keyCode === 13 && input.value.length > 0) {
      clicked(input.value, searchResultsLimit.current);
    }
  };

  const sliderHandler = (val: ReadonlyArray<number>) =>
    (searchResultsLimit.current = val[0]);

  const slider = useMemo(
    () => (
      <Slider
        className={classes.Slider}
        domain={[10, 50]}
        step={1}
        mode={1}
        values={[searchResultsLimit.current]}
        onChange={sliderHandler}
      >
        <Rail>{(railProps) => <TooltipRail {...railProps} />}</Rail>
        <Handles>
          {({ handles, activeHandleID, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={[10, 50]}
                  isActive={handle.id === activeHandleID}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  disabled={false}
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
    ),
    []
  );

  return (
    <div className={classes.SearchBar}>
      <Input
        value={input.value}
        changed={(event) => inputChangedHandler(event)}
        pressed={(event) => pressedHandler(event)}
        invalid={input.touched ? !input.valid : false}
        placeholder={"Enter A Song Name"}
      />
      <p>Search Results Limit</p>
      {slider}
      <Button
        btnType="Search"
        clicked={() => clicked(input.value, searchResultsLimit.current)}
        disabled={!input.valid}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
