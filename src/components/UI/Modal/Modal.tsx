import React from 'react';

import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.scss';

type Props = {
  open: boolean;
  clicked: () => void;
  invisible?: boolean;
  table?: boolean;
  children: React.ReactNode;
};
const Modal: React.FC<Props> = ({
  open,
  clicked,
  invisible,
  table,
  children,
}) => (
  <React.Fragment>
    <Backdrop open={open} clicked={clicked} invisible={invisible} />
    <div
      className={`${classes.Modal} ${table ? classes.Table : ''}`}
      style={{
        transform: open ? 'translate(0)' : 'translate(-100vw)',
        opacity: open ? '1' : '0',
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
