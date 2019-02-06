import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './ContainerComponent.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContainerComponent extends Component {
  render() {
    const {haveTitle2, title, titles, children, onClickRlink, rLinkTitle, showLoader} = this.props;

    let headerStyles = 'header';
    if (haveTitle2)
      headerStyles += ' header-double';
  
    let titlesCmp = titles;
    if (title)
      titlesCmp = <div styleName="title">{title}</div>;

    let contentStyles = 'content';
    if (showLoader)
      contentStyles += ' loader-active';
    
    return (
      <div styleName='ContainerComponent'>
        {showLoader &&
          <div styleName="loader-wrapper">
            <LoaderComponent/>
          </div>
        }
        <div styleName={headerStyles}>
          {titlesCmp}
          {(!!rLinkTitle && !!onClickRlink) &&
            <div styleName="json-fields" onClick={onClickRlink}>
              {rLinkTitle}
            </div>
          }
        </div>
        <div styleName={contentStyles}>
          {children}
        </div>
      </div>
    );
  }
}
