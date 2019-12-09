import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {getUniqueId} from 'utils/common';

import styles from './RadioControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  id = getUniqueId();
  
  onChange = e => {
    const {onChange, disabled, data} = this.props;
    if (onChange && !disabled && e.target.checked)
      onChange(data);
  };

  render() {
    const {data, name, label, disabled, value} = this.props;
    let style = `RadioControl`;
    if (disabled)
      style += ` disabled`;

    return (
      <div styleName={style}>
        <input styleName="input"
               type="radio"
               id={this.id}
               name={name}
               value={data}
               checked={value === data}
               onChange={this.onChange} />
        <label styleName="label" htmlFor={this.id}>{label}</label>
      </div>
    );
  }
}
