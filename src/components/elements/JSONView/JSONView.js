import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './JSONView.sss';


@CSSModules(styles, {allowMultiple: true})
export default class JSONView extends Component {
  render() {
    const json = JSON.stringify(this.props.model, null, 2);

    return (
      <pre styleName="json-wrapper">
        {json}
      </pre>
    );
  }
}
