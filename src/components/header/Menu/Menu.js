import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import {PAGE_MODELS, PAGE_CONTENT, PAGE_API, PAGE_SETTINGS, PAGE_SHARING} from 'ducks/nav';

import styles from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {openedPage, openPage} = this.props;

    let styleModels   = "button";
    let styleApi      = "button";
    let styleContent  = "button";
    let styleSettings = "button";
    let styleSharing  = "button";
    switch(openedPage) {
      case PAGE_MODELS:   styleModels   += " active"; break;
      case PAGE_API:      styleApi      += " active"; break;
      case PAGE_CONTENT:  styleContent  += " active"; break;
      case PAGE_SETTINGS: styleSettings += " active"; break;
      case PAGE_SHARING:  styleSharing  += " active"; break;
    }

    return (
      <div styleName="menu">
        <div styleName={styleModels}    onClick={() => openPage(PAGE_MODELS)}   >Models</div>
        <div styleName={styleApi}       onClick={() => openPage(PAGE_API)}      >API</div>
        <div styleName={styleContent}   onClick={() => openPage(PAGE_CONTENT)}  >Content</div>
        <div styleName={styleSettings}  onClick={() => openPage(PAGE_SETTINGS)} >Settings</div>
        <div styleName={styleSharing}   onClick={() => openPage(PAGE_SHARING)}  >Sharing</div>
      </div>
    );
  }
}
