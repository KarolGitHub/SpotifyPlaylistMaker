import React, { FunctionComponent } from "react";

import classes from "./Backdrop.module.scss";

type Props = {
  open: boolean;
  clicked: () => void;
};
const backdrop: FunctionComponent<Props> = ({ open, clicked }) =>
  open ? <div className={classes.Backdrop} onClick={clicked}></div> : null;

export default backdrop;
