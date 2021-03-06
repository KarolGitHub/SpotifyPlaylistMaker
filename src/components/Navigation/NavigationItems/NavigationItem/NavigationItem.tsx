import React from 'react';

import classes from './NavigationItem.module.scss';
import { NavLink } from 'react-router-dom';

type Props = {
  link: string;
  exact?: boolean;
  children: React.ReactNode;
};

const NavigationItem: React.FC<Props> = ({ link, exact, children }) => (
  <li className={classes.NavigationItem}>
    <NavLink to={link} activeClassName={classes.active} exact={exact}>
      {children}
    </NavLink>
  </li>
);

export default NavigationItem;
