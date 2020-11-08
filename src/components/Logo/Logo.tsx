import React from "react";
import { NavLink } from "react-router-dom";

import Logo from "../../assets/logo.png";
import classes from "./Logo.module.scss";

const logo = () => (
  <div className={classes.Logo}>
    <NavLink to="/" exact>
      <img src={Logo} alt="MyPlaylist" />
    </NavLink>
  </div>
);

export default logo;
