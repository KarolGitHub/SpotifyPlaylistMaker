import React, { FunctionComponent } from 'react';

import classes from './Sidedrawer.module.scss';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';

type Props = {
  open: boolean;
  clicked: () => void;
};

const Sidedrawer: FunctionComponent<Props> = ({ open, clicked }) => {
  const attachedClasses = `${classes.Sidedrawer} ${
    open ? classes.Open : classes.Close
  }`;
  return (
    <React.Fragment>
      <Backdrop open={open} clicked={clicked} />
      <div className={attachedClasses} onClick={clicked}>
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
