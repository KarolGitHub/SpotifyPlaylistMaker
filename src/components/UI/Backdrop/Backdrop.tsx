import React, { FunctionComponent } from "react";

import classes from "./Backdrop.module.scss";

type Props = {
  open: boolean;
  clicked: () => void;
  invisible?: boolean;
};
const backdrop: FunctionComponent<Props> = ({ open, clicked, invisible }) =>
  open ? (
    <div
      className={
        invisible
          ? classes.Backdrop
          : [classes.Backdrop, classes.Visible].join(" ")
      }
      onClick={clicked}
    ></div>
  ) : null;

export default backdrop;
