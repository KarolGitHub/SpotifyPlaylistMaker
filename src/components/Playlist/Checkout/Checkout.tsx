import React, { FunctionComponent, useState } from "react";

// import classes from "./Checkout.module.scss";
import Button from "../../../components/UI/Button/Button";
import Input from "../../UI/Input/Input";
import {
  updateObject,
  isValid,
  PlaylistPayload,
} from "../../../shared/utility";
import classes from "./Checkout.module.scss";

type Props = {
  playlistInfo?: PlaylistPayload;
  cancel: () => void;
  confirm: (data: PlaylistPayload) => void;
};

const Checkout: FunctionComponent<Props> = ({
  playlistInfo,
  cancel,
  confirm,
}) => {
  const [controls, setControls] = useState(
    playlistInfo
      ? {
          name: {
            type: "input",
            elementConfig: {
              type: "text",
              placeholder: "Name",
            },
            value: playlistInfo.name,
            validation: {
              required: true,
            },
            valid: playlistInfo.name.length,
            touched: true,
            note: `Required. The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique, a user may have several playlists with the same name.`,
          },
          public: {
            type: "select",
            elementConfig: {
              options: [
                { value: "true", displayValue: "Public" },
                { value: "false", displayValue: "Private" },
              ],
            },
            value: playlistInfo.public + "",
            validation: null,
            valid: true,
            note: `Optional. Defaults to Public which allows access to other users. If Private it will be unaccessable to other users.`,
          },
          collaborative: {
            type: "select",
            elementConfig: {
              options: [
                { value: "true", displayValue: "Collaborative" },
                { value: "false", displayValue: "Noncollaborative" },
              ],
            },
            value: playlistInfo.collaborative + "",
            validation: null,
            valid: true,
            note: `Optional. Defaults to Noncollaborative. If set to Collaborative any user that you share a link to your playlist can add, delete, and reorder the tracks. Only private playlists may be collaborative`,
          },
          description: {
            type: "input",
            elementConfig: {
              type: "text",
              placeholder: "Description",
            },
            value: playlistInfo.description,
            validation: null,
            valid: true,
            note: `Optional. Value for playlist description as displayed in Spotify Clients and in the Web API.`,
          },
        }
      : {
          name: {
            type: "input",
            elementConfig: {
              type: "text",
              placeholder: "Name",
            },
            value: "",
            validation: {
              required: true,
            },
            valid: false,
            touched: false,
            note: `Required. The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique, a user may have several playlists with the same name.`,
          },
          public: {
            type: "select",
            elementConfig: {
              options: [
                { value: "true", displayValue: "Public" },
                { value: "false", displayValue: "Private" },
              ],
            },
            value: "true",
            validation: null,
            valid: true,
            note: `Optional. Defaults to Public which allows access to other users. If Private it will be unaccessable to other users.`,
          },
          collaborative: {
            type: "select",
            elementConfig: {
              options: [
                { value: "true", displayValue: "Collaborative" },
                { value: "false", displayValue: "Noncollaborative" },
              ],
            },
            value: "false",
            validation: null,
            valid: true,
            note: `Optional. Defaults to Noncollaborative. If set to Collaborative any user that you share a link to your playlist can add, delete, and reorder the tracks. Only private playlists may be collaborative`,
          },
          description: {
            type: "input",
            elementConfig: {
              type: "text",
              placeholder: "Description",
            },
            value: "",
            validation: null,
            valid: true,
            note: `Optional. Value for playlist description as displayed in Spotify Clients and in the Web API.`,
          },
        }
  );

  const inputChangedHandler = (
    event: any,
    inputID: "name" | "public" | "collaborative" | "description"
  ) => {
    event.preventDefault();
    const updatedControls = updateObject(controls, {
      [inputID]: updateObject(controls[inputID], {
        value: event.target.value,
        valid: isValid(event.target.value, controls[inputID].validation),
        touched: true,
      }),
    });
    setControls(updatedControls);
  };

  const confirmHandler = (event: any) => {
    event.preventDefault();
    const formData: any = {};
    Object.entries(controls).map((control: any) => {
      const value = control[1].value;
      if (value === "true") {
        return (formData[control[0]] = true);
      } else if (value === "false") {
        return (formData[control[0]] = false);
      } else {
        return (formData[control[0]] = value);
      }
    });
    confirm(formData);
  };

  const controlsArray: any = [];
  Object.entries(controls).map((control, index) =>
    controlsArray.push({
      id: control[0],
      config: control[1],
    })
  );

  const form = controlsArray.map((control: any, index: number) => (
    <Input
      key={control.id}
      type={control.config.type}
      value={control.config.value}
      changed={(event: any) => inputChangedHandler(event, control.id)}
      invalid={control.config.touched ? !control.config.valid : false}
      elementConfig={control.config.elementConfig}
      focus={index === 0 ? true : false}
      note={control.config.note}
    />
  ));

  return (
    <div>
      <h3>Your Playlist</h3>
      <form onSubmit={confirmHandler}>
        {form}
        <div className={classes.ModalButtons}>
          <Button btnType="cancel" clicked={cancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            btnType="green"
            disabled={
              !controls.name.valid ||
              (controls.public.value === "true" &&
                controls.collaborative.value === "true")
            }
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
