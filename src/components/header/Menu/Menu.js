import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import {PAGE_MODELS, PAGE_CONTENT, PAGE_API, PAGE_SETTINGS, PAGE_SHARING} from 'ducks/nav';
import {ROLE_ADMIN, ROLE_DEVELOPER, ROLE_OWNER, ROLE_EDITOR} from 'models/UserData';

import styles from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {openedPage, openPage, role} = this.props;
    
    let enableModels  = false;
    let enableApi     = false;
    let enableContent = false;
    let enableSettings= false;
    let enableSharing = false;

    let styleModels   = "button";
    let styleApi      = "button";
    let styleContent  = "button";
    let styleSettings = "button";
    let styleSharing  = "button";
    
    switch (role) {
      case ROLE_ADMIN:
      case ROLE_OWNER:
        enableModels  = true;
        enableSettings= true;
        enableSharing = true;
        styleModels   += " enabled";
        styleSettings += " enabled";
        styleSharing  += " enabled";
      case ROLE_DEVELOPER:
        enableApi     = true;
        styleApi      += " enabled";
      case ROLE_EDITOR:
        enableContent = true;
        styleContent  += " enabled";
        break;
    }
    
    switch (openedPage) {
      case PAGE_MODELS:   styleModels   += " active"; break;
      case PAGE_API:      styleApi      += " active"; break;
      case PAGE_CONTENT:  styleContent  += " active"; break;
      case PAGE_SETTINGS: styleSettings += " active"; break;
      case PAGE_SHARING:  styleSharing  += " active"; break;
    }
    

    return (
      <div styleName="menu">
        <div styleName={styleModels}    onClick={() => enableModels   && openPage(PAGE_MODELS)}   >Models</div>
        <div styleName={styleContent}   onClick={() => enableContent  && openPage(PAGE_CONTENT)}  >Content</div>
        <div styleName={styleApi}       onClick={() => enableApi      && openPage(PAGE_API)}      >API</div>
        <div styleName={styleSettings}  onClick={() => enableSettings && openPage(PAGE_SETTINGS)} >Settings</div>
        <div styleName={styleSharing}   onClick={() => enableSharing  && openPage(PAGE_SHARING)}  >Sharing</div>
      </div>
    );
  }
}
