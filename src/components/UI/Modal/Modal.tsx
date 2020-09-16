import React, { FunctionComponent } from "react";

import Backdrop from "../Backdrop/Backdrop";
import classes from "./Modal.module.scss";

type Props = {
  open: boolean;
  clicked: () => void;
  invisible?: boolean;
  table?: boolean;
  children: any;
};
const Modal: FunctionComponent<Props> = ({
  open,
  clicked,
  invisible,
  table,
  children,
}) => (
  <React.Fragment>
    <Backdrop open={open} clicked={clicked} invisible={invisible} />
    <div
      className={
        table ? [classes.Table, classes.Modal].join(" ") : classes.Modal
      }
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
