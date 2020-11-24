import React, { FunctionComponent } from 'react';

import classes from './Menu.module.scss';

type Props = {
  clicked: () => void;
};

const Menu: FunctionComponent<Props> = ({ clicked }) => (
  <div className={classes.Menu} onClick={clicked}>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Menu;
