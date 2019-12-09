import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {getUniqueId} from 'utils/common';

import styles from './SwitchControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SwitchControl extends Component {
  id = getUniqueId();
  
  onChange = e => {
    const {onChange, disabled} = this.props;
    if (onChange && !disabled)
      onChange(e.target.checked);
  };
  
  render() {
    const {label, disabled, checked} = this.props;
    let style = `SwitchControl`;
    if (checked === undefined)
      style += ` undefined`;
    if (disabled)
      style += ` disabled`;
    
    return (
      <div styleName={style}>
        <input type="checkbox"
               styleName="checkbox"
               id={this.id}
               disabled={disabled}
               checked={!!checked}
               onChange={this.onChange}
        />
        <label styleName="label" htmlFor={this.id}>{label}</label>
      </div>
    );
  }
}
