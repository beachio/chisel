import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import _ from 'lodash/core';

import styles from './CheckboxControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class CheckboxControl extends Component {
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
    const {title, checked, disabled, labelStyles, checkboxStyles} = this.props;
    let style = `CheckboxControl`;
    if (disabled)
      style += ` disabled`;

    return (
      <div styleName={style}>
        <div styleName="checkbox-button">
          <input styleName="checkbox"
                 type="checkbox"
                 id={this.id}
                 name="checkbox"
                 disabled={disabled}
                 checked={checked}
                 onChange={this.onChange} />
          <label styleName="checkbox-label" htmlFor={this.id}>{title}</label>
        </div>
      </div>
    );
  }
}
