import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import _ from 'lodash/core';

import styles from './SwitchControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SwitchControl extends Component {
  id = '0';
  
  constructor(props) {
    super(props);
    
    this.id = _.uniqueId('switch_');
  }
  
  onChange = e => {
    const {onChange, disabled} = this.props;
    if (onChange && !disabled)
      onChange(e.target.checked);
  };
  
  render() {
    const {title, checked, disabled} = this.props;
    let style = `SwitchControl`;
    if (disabled)
      style += ` disabled`;
    
    return (
      <div styleName={style}>
        <input type="checkbox"
               styleName="checkbox"
               id={this.id}
               disabled={disabled}
               checked={checked}
               onChange={this.onChange}
        />
        <label styleName="label" htmlFor={this.id}>{title}</label>
      </div>
    );
  }
}
