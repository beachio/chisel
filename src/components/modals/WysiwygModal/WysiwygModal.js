import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './WysiwygModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class WysiwygModal extends Component  {
  render() {
    return (
      <div styleName="loader-wrapper">
        <div styleName="loader">
          <div styleName="loader-inner"></div>
        </div>
      </div>
    );
  }
}
