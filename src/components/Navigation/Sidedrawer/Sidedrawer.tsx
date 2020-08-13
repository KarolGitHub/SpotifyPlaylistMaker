import React, { FunctionComponent } from "react";

import classes from "./Sidedrawer.module.scss";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import Backdrop from "../../UI/Backdrop/Backdrop";

type Props = {
  open: boolean;
  clicked: () => void;
};

const Sidedrawer: FunctionComponent<Props> = ({ open, clicked }) => {
  let attachedClasses = [classes.Sidedrawer, classes.Close];
  if (open) {
    attachedClasses = [classes.Sidedrawer, classes.Open];
  }
  return (
    <React.Fragment>
      <Backdrop open={open} clicked={clicked} />
      <div className={attachedClasses.join(" ")} onClick={clicked}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </React.Fragment>
  );
};

export default Sidedrawer;
