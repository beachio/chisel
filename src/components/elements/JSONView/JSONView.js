import React from 'react';

import styles from './JSONView.sss';


export default props => (
  <pre className={styles["json-wrapper"]}>
    {JSON.stringify(props.model, null, 2)}
  </pre>
);
