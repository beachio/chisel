import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import _ from 'lodash/core';

import styles from './SwitchControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SwitchControl extends Component {
  render() {
    const {title, checked, onChange} = this.props;
    let id = _.uniqueId('switch_');
    return (
      <div styleName="SwitchControl">
        <input type="checkbox"
               styleName="checkbox"
               id={id}
               checked={checked}
               onChange={onChange}
        />
        <label styleName="label" htmlFor={id}>{title}</label>
      </div>
    );
  }
}
