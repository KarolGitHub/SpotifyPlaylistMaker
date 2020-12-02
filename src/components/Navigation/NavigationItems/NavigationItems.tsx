import React, { useLayoutEffect, useState } from 'react';
import { RootState } from '../../../index';
import { useSelector } from 'react-redux';

import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.scss';

let savedThemeMode = localStorage.getItem('theme');

const NavigationItems: React.FC = () => {
  const token: boolean = useSelector((state: RootState) => {
    return state.auth.token !== null;
  });
  const [theme, setTheme] = useState(savedThemeMode ? true : false);

  const themeSwitchHandler = () => {
    if (theme) {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', 'theme-dark');
    }
    setTheme(!theme);
    document.body.classList.toggle('theme-dark');
  };

  useLayoutEffect(() => {
    if (savedThemeMode) {
      document.body.classList.toggle('theme-dark');
      savedThemeMode = null;
    }
  }, []);

  return (
    <ul className="navigationItems">
      <li className="switch">
        <label>
          <div>
            <input onChange={themeSwitchHandler} type="checkbox" />
            <span className="slider round"></span>
          </div>
        </label>
      </li>
      <NavigationItem link="/" exact>
        Playlist Maker
      </NavigationItem>
      {token ? (
        <NavigationItem link="/playlists">Playlists</NavigationItem>
      ) : null}
      {token ? (
        <NavigationItem link="/logout">Log Out</NavigationItem>
      ) : (
        <NavigationItem link="/login">Log In</NavigationItem>
      )}
    </ul>
  );
};

export default NavigationItems;
