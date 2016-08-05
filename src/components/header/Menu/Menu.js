import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Menu.sss';
import {PAGE_MODELS, PAGE_CONTENT, PAGE_API, PAGE_SETTINGS, PAGE_SHARING} from 'ducks/nav';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
  componentWillReceiveProps(nextProps) {
  }
  
  render() {
    const {openPage} = this.props;
    
    return (
      <div styleName="nav">
        <div styleName="button">
          <div styleName="button-inner" onClick={() => openPage(PAGE_MODELS)}>Models</div>
        </div>
        
        <div styleName="button">
          <div styleName="button-inner" onClick={() => openPage(PAGE_API)}>API</div>
        </div>
        
        <div styleName="button">
          <div styleName="button-inner" onClick={() => openPage(PAGE_CONTENT)}>Content</div>
        </div>
        
        <div styleName="button">
          <div styleName="button-inner" onClick={() => openPage(PAGE_SETTINGS)}>Settings</div>
        </div>
  
        <div styleName="button">
          <div styleName="button-inner" onClick={() => openPage(PAGE_SHARING)}>Sharing</div>
        </div>
      </div>
  );
  }
}
