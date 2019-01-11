import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import IconsComponent from 'components/elements/IconsComponent/IconsComponent';

import styles from './InputControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class InputControl extends Component {
  render() {
    let {label, type, value, placeholder, onChange, readOnly, autoFocus, onKeyDown, onBlur, DOMRef, icon,
      onIconClick, inputType, dropdown, titled} = this.props;

    if (readOnly || !onChange) {
      readOnly = true;
      onChange = null;
    }

    if (value == undefined || value == null)
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
                 onChange={onChange}
                 onBlur={onBlur}
                 onKeyDown={onKeyDown}
                 readOnly={readOnly}
                 ref={DOMRef} />
        </div>
      </div>
    );
  }
}
