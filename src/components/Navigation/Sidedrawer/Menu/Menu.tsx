import React from 'react';

import classes from './Menu.module.scss';

type Props = {
  clicked: () => void;
};

const Menu: React.FC<Props> = ({ clicked }) => (
  <div className={classes.Menu} onClick={clicked}>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Menu;
