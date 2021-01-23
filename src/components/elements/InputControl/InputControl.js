import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {addElectronContextMenu} from "utils/common";

import IconsComponent from 'components/elements/IconsComponent/IconsComponent';

import styles from './InputControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class InputControl extends Component {
  ref = React.createRef();

  onChange = e => {
    const {onChange} = this.props;
    if (onChange)
      onChange(e.target.value);
  };

  setRef = ref => {
    const {readOnly} = this.props;
    addElectronContextMenu(ref.current, readOnly);
    this.ref = ref;
  };

  render() {
    let {label, type, value, placeholder, onChange, readOnly, autoFocus, onKeyDown, onBlur, icon,
      onIconClick, inputType, dropdown, titled, red, DOMRef} = this.props;

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
    if (label || titled)
      inputStyles += ' input-titled';
    if (red)
      inputStyles += ' input-red';


    let iconEl;
    if (icon)
      iconEl = (
        <div onClick={onIconClick} styleName={'icon ' + icon}>
          <IconsComponent icon={icon} />
        </div>);

    if (DOMRef)
      DOMRef(this.ref.current);

    return (
      <div styleName="InputControl">
        {!!label &&
          <label styleName="label">{label}</label>
        }
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
