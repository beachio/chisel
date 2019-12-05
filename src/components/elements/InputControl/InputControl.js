import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {addElectronContextMenu} from "utils/common";

import IconsComponent from 'components/elements/IconsComponent/IconsComponent';

import styles from './InputControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class InputControl extends Component {
  onChange = e => {
    const {onChange} = this.props;
    if (onChange)
      onChange(e.target.value);
  };

  ref = elm => {
    const {DOMRef, readOnly} = this.props;
    addElectronContextMenu(elm, readOnly);
    if (DOMRef && elm)
      DOMRef(elm);
  };

  render() {
    let {label, type, value, placeholder, onChange, readOnly, autoFocus, onKeyDown, onBlur, icon,
      onIconClick, inputType, dropdown, titled, red} = this.props;

    if (!onChange)
      readOnly = true;

    if (value == undefined)
      value = ``;

    if (!inputType)
      inputType = `text`;

    let inputStyles = 'input';
    if (type === 'big')
      inputStyles = 'input-big';
    if (readOnly)
      inputStyles += ' input-readOnly';
    if (dropdown)
      inputStyles += ' input-disabled';
    if (titled)
      inputStyles += ' input-titled';
    if (red)
      inputStyles += ' input-red';


    let iconEl;
    if (icon)
      iconEl = (
        <div onClick={onIconClick} styleName={'icon ' + icon}>
          <IconsComponent icon={icon} />
        </div>);

    return (
      <div styleName="InputControl">
        <label styleName="label"> {label} </label>
        <div styleName="input-wrapper">
          {iconEl}
          <input type={inputType}
                 styleName={inputStyles}
                 value={value}
                 autoFocus={autoFocus}
                 placeholder={placeholder}
                 onChange={this.onChange}
                 onBlur={onBlur}
                 onKeyDown={onKeyDown}
                 readOnly={readOnly}
                 ref={this.ref} />
        </div>
      </div>
    );
  }
}
