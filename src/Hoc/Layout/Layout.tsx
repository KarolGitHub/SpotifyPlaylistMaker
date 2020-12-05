import React, { useEffect, useLayoutEffect, useState } from 'react';

import classes from './Layout.module.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Sidedrawer from '../../components/Navigation/Sidedrawer/Sidedrawer';

type Props = {
  children: React.ReactNode;
};

const savedThemeMode = localStorage.getItem('theme') === 'dark-theme';
const darkThemePrefference =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const Layout: React.FC<Props> = ({ children }) => {
  const [showSideDrawer, setSideDrawer] = useState(false);

  useLayoutEffect(() => {
    if (savedThemeMode || darkThemePrefference) {
      document.body.classList.toggle('dark-theme');
    }
  }, []);

  useEffect(() => {
    const rootElement: any = document.querySelector('*');
    rootElement?.style.setProperty(
      '--theme-transition',
      'background-color 0.6s ease, color 1s ease'
    );
  }, []);

  return (
    <React.Fragment>
      <Toolbar openMenu={() => setSideDrawer(!showSideDrawer)}></Toolbar>
      <Sidedrawer open={showSideDrawer} clicked={() => setSideDrawer(false)} />

      <main className={classes.Layout}>{children}</main>
    </React.Fragment>
  );
};

export default Layout;
