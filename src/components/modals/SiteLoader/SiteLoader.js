import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './SiteLoader.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SiteLoader extends Component  {
  render() {
    return (
      <div styleName="loader">
        <img src={require("./loader.gif")} />
      </div>
    );
  }
}
