import React, { FunctionComponent } from "react";
import classes from "./Input.module.scss";

type Props = {
  value?: string;
  changed: (event: { target: HTMLInputElement }) => void;
  pressed: (event: { keyCode: number }) => void;
  invalid: boolean;
  placeholder: string;
};
const Input: FunctionComponent<Props> = ({
  value,
  changed,
  pressed,
  invalid,
  placeholder,
}) => {
  const inputClasses = [classes.InputElement];

  let validationError = null;

  if (invalid) {
    validationError = (
      <p className={classes.ValidationError}>Please enter a proper value</p>
    );
    inputClasses.push(classes.Invalid);
  }
  return (
    <div className={classes.Input}>
      <input
        className={inputClasses.join(" ")}
        value={value}
        type="text"
        autoFocus
        onBlur={() => invalid}
        onChange={(event) => changed(event)}
        onKeyUp={(event) => pressed(event)}
        placeholder={placeholder}
      />
      {validationError}
    </div>
  );
};

export default Input;
