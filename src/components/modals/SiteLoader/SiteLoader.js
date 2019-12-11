import React from 'react';

import LoaderComponent from 'components/elements/LoaderComponent/LoaderComponent';

import styles from './SiteLoader.sss';


export default () => (
  <div className={styles["loader-wrapper"]}>
    <LoaderComponent />
  </div>
);
