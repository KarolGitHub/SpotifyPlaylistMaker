import React, { FunctionComponent } from "react";

import Backdrop from "../Backdrop/Backdrop";
import classes from "./Modal.module.scss";

type Props = {
  open: boolean;
  clicked: () => void;
  invisible?: boolean;
  children: any;
};
const Modal: FunctionComponent<Props> = ({
  open,
  clicked,
  invisible,
  children,
}) => (
  <React.Fragment>
    <Backdrop open={open} clicked={clicked} invisible={invisible} />
    <div
      className={classes.Modal}
      style={{
        transform: open ? "translate(0)" : "translate(-100vh)",
        opacity: open ? "1" : "0",
      }}
    >
      {children}
    </div>
  </React.Fragment>
);

export default React.memo(Modal, (prevProps, nextProps) => {
  return (
    nextProps.open === prevProps.open &&
    nextProps.children === prevProps.children
  );
});
