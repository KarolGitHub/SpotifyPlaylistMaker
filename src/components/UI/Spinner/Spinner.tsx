import React, { FunctionComponent } from "react";

import classes from "./Spinner.module.scss";

const spinner: FunctionComponent = () => {
  return <div className={classes.Spinner}>Loading...</div>;
};

export default spinner;
