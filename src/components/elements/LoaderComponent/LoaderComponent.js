import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './LoaderComponent.sss';


@CSSModules(styles, {allowMultiple: true})
export default class LoaderComponent extends Component  {
  render() {
    return (
      <div styleName="loader">
        <div styleName="loader-inner"></div>
      </div>
    );
  }
}
