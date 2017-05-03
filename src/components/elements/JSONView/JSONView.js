import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './JSONView.sss';


@CSSModules(styles, {allowMultiple: true})
export default class JSONView extends Component {

  render() {
    return (
      <pre styleName="json-wrapper">
        {this.props.content}
      </pre>
    );
  }
}
