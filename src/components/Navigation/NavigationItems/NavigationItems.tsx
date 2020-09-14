import React, { FunctionComponent } from "react";
import { RootState } from "../../../index";
import { useSelector } from "react-redux";

import NavigationItem from "./NavigationItem/NavigationItem";
import "./NavigationItems.scss";

const NavigationItems: FunctionComponent = () => {
  const token: boolean = useSelector((state: RootState) => {
    return state.auth.token !== null;
  });

  const themeSwitchHandler = () => {
    document.body.classList.toggle("dark-theme");
  };
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
