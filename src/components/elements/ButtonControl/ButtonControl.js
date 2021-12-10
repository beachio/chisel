import React from 'react';

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './ButtonControl.sss';


export default ({value, color, onClick, type, disabled, DOMRef, showLoader, minWidth}) => {
  if (!type)
    type = 'button';

  if (!minWidth)
    minWidth = 150;

  let buttonControlClasses = styles.ButtonControl;
  if (disabled) {
    onClick = null;
    buttonControlClasses += ' ' + styles[`ButtonControl-disabled`];
  } else if (color) {
    buttonControlClasses += ' ' + styles[`ButtonControl-${color}`];
  }

  let ref = React.createRef();
  if (DOMRef)
    DOMRef(ref.current);

  return (
    <button className={buttonControlClasses}
            style={{minWidth}}
            onClick={onClick}
            type={type}
            ref={ref}>
      {value}
      {showLoader &&
        <div className={styles["loader-wrapper"]}>
          <LoaderComponent/>
        </div>
      }
    </button>
  );
}
