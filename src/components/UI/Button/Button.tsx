import React, { FunctionComponent } from "react";
import classes from "./Button.module.scss";

type Props = {
  btnType?: string;
  clicked: () => void;
  disabled?: boolean;
  children?: any;
};
const Button: FunctionComponent<Props> = ({
  btnType,
  children,
  clicked,
  disabled,
}) => {
  let className = classes.Button;
  switch (btnType) {
    case "Search":
      className = [classes.Button, classes.Search].join(" ");
      break;
    case "Save":
      className = [classes.Button, classes.Save].join(" ");
      break;
    case "Cancel":
      className = [classes.Button, classes.Cancel].join(" ");
      break;
    case "Confirm":
      className = [classes.Button, classes.Confirm].join(" ");
      break;
    default:
  }

  return (
    <button className={className} onClick={clicked} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
