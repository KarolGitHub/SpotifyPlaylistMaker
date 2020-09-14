import React, { FunctionComponent } from "react";
import classes from "./Input.module.scss";

type Props = {
  type?: "input" | "select";
  value: string;
  changed: (event: { target: any }) => void;
  pressed?: (event: any) => void;
  invalid?: boolean;
  elementConfig: any;
  focus: boolean;
  note?: string;
};
const Input: FunctionComponent<Props> = ({
  type,
  value,
  changed,
  pressed,
  invalid,
  elementConfig,
  focus,
  note,
}) => {
  const inputClasses = [classes.InputElement];

  let validationError = null;
  let inputElement = null;

  if (invalid) {
    validationError = (
      <p className={classes.ValidationError}>Please enter a proper value</p>
    );
    inputClasses.push(classes.Invalid);
  }

  switch (type) {
    case "input":
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          value={value}
          onBlur={() => invalid}
          onChange={changed}
          autoFocus={focus}
          {...elementConfig}
          title={note}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={inputClasses.join(" ")}
          value={value}
          onBlur={() => invalid}
          onChange={changed}
          title={note}
        >
          {elementConfig.options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          value={value}
          onChange={changed}
          onKeyUp={pressed}
          onBlur={() => invalid}
          className={inputClasses.join(" ")}
          autoFocus={focus}
          {...elementConfig}
        />
      );
  }
  return (
    <div className={classes.Input}>
      {inputElement}
      {validationError}
    </div>
  );
};

export default Input;
