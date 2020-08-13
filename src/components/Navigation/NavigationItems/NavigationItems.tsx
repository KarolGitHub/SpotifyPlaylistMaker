import React, { FunctionComponent } from "react";

import NavigationItem from "./NavigationItem/NavigationItem";
import "./NavigationItems.scss";

type Props = {};

const NavigationItems: FunctionComponent<Props> = () => {
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
      <NavigationItem link="/login">Log In</NavigationItem>
    </ul>
  );
};

export default NavigationItems;
