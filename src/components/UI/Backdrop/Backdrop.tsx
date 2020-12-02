import React from 'react';

import classes from './Backdrop.module.scss';

type Props = {
  open: boolean;
  clicked: () => void;
  invisible?: boolean;
};
const backdrop: React.FC<Props> = ({ open, clicked, invisible }) =>
  open ? (
    <div
      className={`${classes.Backdrop} ${invisible ? '' : classes.Visible}`}
      onClick={clicked}
    ></div>
  ) : null;

export default backdrop;
