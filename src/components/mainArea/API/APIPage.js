import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './APIPage.sss';


@CSSModules(styles, {allowMultiple: true})
export default class APIPage extends Component  {
  render() {
    return (
      <div styleName="start-working">
        <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
        <div styleName="docs">
          Check <a styleName="docs-link" href="http://parseplatform.github.io/docs/" target="_blank">Parse</a> docs!
        </div>
      </div>
    );
  }
}
