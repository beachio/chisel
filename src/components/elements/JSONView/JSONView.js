import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './JSONView.sss';


@CSSModules(styles, {allowMultiple: true})
export default class JSONView extends Component {

  render() {
    const {content} = this.props;

    return (
      <pre styleName="json-wrapper">
        {content}
      </pre>
    );
  }
}
