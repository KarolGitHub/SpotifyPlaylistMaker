import React from "react";

import Logo from "../../assets/logo.png";
import classes from "./Logo.module.scss";

const logo = () => (
  <div className={classes.Logo}>
    <img src={Logo} alt="MyPlaylist" />
  </div>
);

export default logo;
