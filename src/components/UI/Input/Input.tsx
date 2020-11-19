import React, { FunctionComponent, useEffect, useRef } from "react";
import classes from "./Input.module.scss";
import { isMobile } from "../../../shared/utility";

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
  const inputRef = useRef<HTMLInputElement>();
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
          ref={(el: any) => (inputRef.current = el)}
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
          ref={(el: any) => (inputRef.current = el)}
          {...elementConfig}
        />
      );
  }

  useEffect(() => {
    if (!isMobile && focus) {
      inputRef.current?.focus();
    }
  }, [focus]);

  return (
    <div className={classes.Input}>
      {inputElement}
      {validationError}
    </div>
  );
};

export default Input;
