import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './SwitchControl.sss';

@CSSModules(styles, {allowMultiple: true})
export default class SwitchControl extends Component {
  render() {
    return (
      <div>
        SwitchControl
      </div>
    );
  }
}
