import * as React from "react";
import { SliderItem } from "react-compound-slider";
import "./SliderItems.scss";

const { Component, Fragment } = React;

// *******************************************************
// TOOLTIP RAIL
// *******************************************************
const railStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: 40,
  top: -13,
  borderRadius: 7,
  cursor: "pointer",
  opacity: 0.3,
  zIndex: 300,
  border: "1px solid grey",
};

const railCenterStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: 14,
  borderRadius: 7,
  cursor: "pointer",
  pointerEvents: "none",
  backgroundColor: "rgb(155,155,155)",
};

interface TooltipRailProps {
  activeHandleID: string;
  getRailProps: (props: object) => object;
  getEventData: (e: Event) => object;
}

export class TooltipRail extends Component<TooltipRailProps> {
  state = {
    value: null,
    percent: null,
  };

  static defaultProps = {
    disabled: false,
  };

  onMouseEnter = () => {
    document.addEventListener("mousemove", this.onMouseMove);
  };

  onMouseLeave = () => {
    this.setState({ value: null, percent: null });
    document.removeEventListener("mousemove", this.onMouseMove);
  };

  onMouseMove = (e: Event) => {
    const { activeHandleID, getEventData } = this.props;

    if (activeHandleID) {
      this.setState({ value: null, percent: null });
    } else {
      this.setState(getEventData(e));
    }
  };

  render() {
    const { value, percent } = this.state;
    const { activeHandleID, getRailProps } = this.props;

    return (
      <Fragment>
        {!activeHandleID && value ? (
          <div
            style={{
              left: `${percent}%`,
              position: "absolute",
              marginLeft: "-11px",
              marginTop: "-35px",
            }}
          >
            <div className="tooltip">
              <span className="tooltiptext">{value}</span>
            </div>
          </div>
        ) : null}
        <div
          style={railStyle}
          {...getRailProps({
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
          })}
        />
        <div style={railCenterStyle} />
      </Fragment>
    );
  }
}

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
interface HandleProps {
  key: string;
  handle: SliderItem;
  isActive: Boolean;
  disabled?: Boolean;
  domain: number[];
  getHandleProps: (id: string, config: object) => object;
}

export class Handle extends Component<HandleProps> {
  static defaultProps = {
    disabled: false,
  };

  state = {
    mouseOver: false,
  };

  onMouseEnter = () => {
    this.setState({ mouseOver: true });
  };

  onMouseLeave = () => {
    this.setState({ mouseOver: false });
  };

  render() {
    const {
      domain: [min, max],
      handle: { id, value, percent },
      isActive,
      disabled,
      getHandleProps,
    } = this.props;
    const { mouseOver } = this.state;

    return (
      <Fragment>
        {(mouseOver || isActive) && !disabled ? (
          <div
            style={{
              left: `${percent}%`,
              position: "absolute",
              marginLeft: "-11px",
              marginTop: "-35px",
            }}
          >
            <div className="tooltip">
              <span className="tooltiptext">{value}</span>
            </div>
          </div>
        ) : null}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          style={{
            left: `${percent}%`,
            position: "absolute",
            marginLeft: "-11px",
            marginTop: "-6px",
            zIndex: 400,
            width: 24,
            height: 24,
            cursor: "pointer",
            border: 0,
            borderRadius: "50%",
            boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.4)",
            backgroundColor: disabled ? "#666" : "#007bff",
          }}
          {...getHandleProps(id, {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
          })}
        />
      </Fragment>
    );
  }
}

// *******************************************************
// TRACK COMPONENT
// *******************************************************
interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  disabled: Boolean;
  getTrackProps: () => object;
}

export function Track({
  source,
  target,
  getTrackProps,
  disabled = false,
}: TrackProps) {
  return (
    <div
      style={{
        position: "absolute",
        height: 14,
        zIndex: 1,
        backgroundColor: disabled ? "#999" : "#3e1db3",
        borderRadius: 7,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
}

// *******************************************************
// TICK COMPONENT
// *******************************************************
interface TickProps {
  tick: SliderItem;
  count: number;
  format: (val: number) => string;
}

const defaultFormat = (d: number) => `d`;

export function Tick({ tick, count, format = defaultFormat }: TickProps) {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: 17,
          width: 1,
          height: 5,
          backgroundColor: "rgb(200,200,200)",
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          position: "absolute",
          marginTop: 25,
          fontSize: 10,
          textAlign: "center",
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        {format(tick.value)}
      </div>
    </div>
  );
}
