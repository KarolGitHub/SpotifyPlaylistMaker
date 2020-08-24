import React, { FunctionComponent, useState, useCallback } from "react";

// import classes from "./Checkout.module.scss";
import Button from "../../../components/UI/Button/Button";
import Input from "../../UI/Input/Input";
import { updateObject, isValid } from "../../../shared/utility";

type Props = {
  cancel: () => void;
  confirm: (val: string) => void;
};

const Checkout: FunctionComponent<Props> = ({ cancel, confirm }) => {
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

  const pressedHandler = (event: { keyCode: number }) => {
    if (event.keyCode === 13) {
      confirm(input.value);
    } else if (event.keyCode === 27) {
      cancel();
    }
  };

  return (
    <div>
      <h3>Your Playlist</h3>
      <Input
        value={input.value}
        changed={(event) => inputChangedHandler(event)}
        pressed={(event) => pressedHandler(event)}
        invalid={input.touched ? !input.valid : false}
        placeholder={"Enter A Playlist Name"}
      />
      <Button btnType="Cancel" clicked={cancel}>
        Cancel
      </Button>
      <Button
        btnType="Confirm"
        clicked={() => confirm(input.value)}
        disabled={!input.valid}
      >
        Confirm
      </Button>
    </div>
  );
};

export default Checkout;
