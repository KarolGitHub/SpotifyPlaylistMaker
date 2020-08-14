import React, { FunctionComponent, useState, useCallback } from "react";

import classes from "./SearchBar.module.scss";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import { updateObject, isValid } from "../../../shared/utility";

type Props = {
  clicked: (val: string) => void;
}

const SearchBar: FunctionComponent<Props> = ({ clicked }) => {
  const [input, setInput] = useState({
    value: "",
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
  });

  const inputChangedHandler = useCallback(
    (event: { target: HTMLInputElement }) => {
      const updatedInput = updateObject(input, {
        value: event.target.value,
        valid: isValid(event.target.value, input.validation),
        touched: true,
      });
      setInput(updatedInput);
    },
    [input]
  );

  return (
    <div className={classes.SearchBar}>
      <Input
        value={input.value}
        changed={(event) => inputChangedHandler(event)}
        invalid={input.touched ? !input.valid : false}
        placeholder={"Enter A Song Name"}
      />
      <Button
        btnType="Search"
        clicked={() => clicked(input.value)}
        disabled={!input.valid}>
        Search
      </Button>
    </div>
  );
};

export default React.memo(SearchBar);
