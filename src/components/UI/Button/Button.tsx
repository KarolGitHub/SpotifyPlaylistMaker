import React from 'react';
import classes from './Button.module.scss';

type Props = {
  btnType?: string;
  table?: boolean;
  clicked?: (event: any) => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  children?: any;
};
const Button: React.FC<Props> = ({
  btnType,
  table,
  children,
  clicked,
  type,
  disabled,
}) => {
  let btnClassType;
  switch (btnType) {
    case 'blue':
      btnClassType = ` ${classes.Blue} `;
      break;
    case 'purple':
      btnClassType = ` ${classes.Purple} `;
      break;
    case 'red':
      btnClassType = ` ${classes.Red} `;
      break;
    case 'green':
      btnClassType = ` ${classes.Green} `;
      break;
    case 'cancel':
      btnClassType = ` ${classes.Cancel} `;
      break;
    default:
      btnClassType = ``;
  }
  const btnClasses = `${classes.Button}${btnClassType}${
    table ? ' ' + classes.TableButton : ''
  }`;

  return (
    <button
      className={btnClasses}
      onClick={clicked}
      disabled={disabled}
      type={type ? type : 'button'}
    >
      {children}
    </button>
  );
};

export default Button;
