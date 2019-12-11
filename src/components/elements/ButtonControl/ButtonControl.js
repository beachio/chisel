import React from 'react';

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './ButtonControl.sss';


export default ({value, color, onClick, type, disabled, DOMRef, showLoader}) => {
  if (!type)
    type = 'button';

  let buttonControlClasses = styles.ButtonControl;
  if (disabled) {
    onClick = null;
    buttonControlClasses += ' ' + styles[`ButtonControl-disabled`];
  } else if (color) {
    buttonControlClasses += ' ' + styles[`ButtonControl-${color}`];
  }

  return (
    <button className={buttonControlClasses}
            onClick={onClick}
            type={type}
            ref={DOMRef}>
      {value}
      {showLoader &&
        <div className={styles["loader-wrapper"]}>
          <LoaderComponent/>
        </div>
      }
    </button>
  );
}
