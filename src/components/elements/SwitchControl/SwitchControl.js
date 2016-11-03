import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './SwitchControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SwitchControl extends Component {
  render() {
    const {title, checked, onChange} = this.props;

    return (
      <div styleName="SwitchControl">
        <input type="checkbox"
               styleName="checkbox"
               id="checkbox"
               checked={checked}
               onChange={onChange}
        />
        <label styleName="label" htmlFor="checkbox">{title}</label>
      </div>
    );
  }
}
