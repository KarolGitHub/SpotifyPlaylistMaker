import React, { FunctionComponent } from "react";
import classes from "./Button.module.scss";

type Props = {
  btnType?: string;
  table?: boolean;
  clicked?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  children?: any;
};
const Button: FunctionComponent<Props> = ({
  btnType,
  table,
  children,
  clicked,
  type,
  disabled,
}) => {
  let className;
  switch (btnType) {
    case "blue":
      className = [classes.Button, classes.Blue].join(" ");
      break;
    case "purple":
      className = [classes.Button, classes.Purple].join(" ");
      break;
    case "red":
      className = [classes.Button, classes.Red].join(" ");
      break;
    case "green":
      className = [classes.Button, classes.Green].join(" ");
      break;
    case "cancel":
      className = [classes.Button, classes.Cancel].join(" ");
      break;
    default:
      className = classes.Button;
  }
  if (table) {
    className = [className, classes.TableButton].join(" ");
  }

  return (
    <button
      className={className}
      onClick={clicked}
      disabled={disabled}
      type={type ? type : "button"}
    >
      {children}
    </button>
  );
};

export default Button;
