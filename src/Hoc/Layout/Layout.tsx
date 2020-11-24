import React, { FunctionComponent, useState } from 'react';

import classes from './Layout.module.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Sidedrawer from '../../components/Navigation/Sidedrawer/Sidedrawer';

type Props = {
  children: any;
};

const Layout: FunctionComponent<Props> = ({ children }) => {
  const [showSideDrawer, setSideDrawer] = useState(false);

  return (
    <React.Fragment>
      <Toolbar openMenu={() => setSideDrawer(!showSideDrawer)}></Toolbar>
      <Sidedrawer open={showSideDrawer} clicked={() => setSideDrawer(false)} />

      <main className={classes.Layout}>{children}</main>
    </React.Fragment>
  );
};

export default Layout;
