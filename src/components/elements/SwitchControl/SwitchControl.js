import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './SwitchControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SwitchControl extends Component {
  render() {
    const {title} = this.props;

    return (
      <div styleName="SwitchControl">
        <input type="checkbox" styleName="checkbox" id="checkbox" />
        <label styleName="label" htmlFor="checkbox">{title}</label>
      </div>
    );
  }
}
