import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './ContainerComponent.sss';

@CSSModules(styles, {allowMultiple: true})
export default class ContainerComponent extends Component {
  render() {
    const {haveTitle2, title, titles, children, onClickBack, onClickRLink, rLinkTitle, backgroundOffset} = this.props;
    
    let headerStyles = 'header';
    if (haveTitle2)
      headerStyles = 'header header-double';
  
    let titlesCmp = titles;
    if (title)
      titlesCmp = <div styleName="title">{title}</div>;

    let backStyle = {};
    if (backgroundOffset)
      backStyle = {height: `calc(100% - ${backgroundOffset}px)`};

    return (
      <div styleName='ContainerComponent'>
        {/* <div styleName="background" style={backStyle}></div> */}
        <div styleName={headerStyles}>
          {
            onClickBack &&
              <div styleName='back' onClick={onClickBack}>
                Back
              </div>
          }
          {titlesCmp}
          {
            rLinkTitle && onClickRLink &&
              <div styleName="json-fields" onClick={onClickRLink}>
                {rLinkTitle}
              </div>
          }
        </div>
        <div styleName='content'>
          {children}
        </div>
      </div>
    );
  }
}
