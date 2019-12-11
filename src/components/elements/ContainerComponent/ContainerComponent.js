import React from 'react';

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './ContainerComponent.sss';


export default ({haveTitle2, title, titles, children, onClickRlink, rLinkTitle, showLoader}) => {
  let headerStyles = styles['header'];
  if (haveTitle2)
    headerStyles += ' ' + styles['header-double'];

  let titlesCmp = titles;
  if (title)
    titlesCmp = <div className={styles.title}>{title}</div>;

  let contentStyles = styles['content'];
  if (showLoader)
    contentStyles += ' ' + styles['loader-active'];

  return (
    <div className={styles.ContainerComponent}>
      {showLoader &&
        <div className={styles["loader-wrapper"]}>
          <LoaderComponent/>
        </div>
      }
      <div className={headerStyles}>
        {titlesCmp}
        {(!!rLinkTitle && !!onClickRlink) &&
          <div className={styles["json-fields"]} onClick={onClickRlink}>
            {rLinkTitle}
          </div>
        }
      </div>
      <div className={contentStyles}>
        {children}
      </div>
    </div>
  );
}
