import React from 'react';

import styles from './LoaderComponent.sss';


export default () => (
  <div className={styles["loader"]}>
    <div className={styles["loader-inner"]}></div>
  </div>
);
