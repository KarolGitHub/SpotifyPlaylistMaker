import React, { FunctionComponent } from "react";

import classes from "./Toolbar.module.scss";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import Menu from "../Sidedrawer/Menu/Menu";

type Props = {
  openMenu: () => void;
};

const toolbar: FunctionComponent<Props> = ({ openMenu }) => (
  <header className={classes.Toolbar}>
    <Menu clicked={openMenu} />
    <div className={classes.Logo}>
      <Logo />
    </div>
    <nav className={classes.DesktopOnly}>
      <NavigationItems />
    </nav>
  </header>
);

export default toolbar;
