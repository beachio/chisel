import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import styles from './InputControl.sss';

import IconsComponent from '../IconsComponent/IconsComponent';

@CSSModules(styles, {allowMultiple: true})
export default class InputControl extends Component {
  render() {
    const {label, type, value, placeholder, onChange, readOnly, autoFocus, onKeyDown, inputRef, icon, onIconClick} = this.props;
    let inputValue = value;
    let inputPlaceholder = placeholder;
    let inputStyles = 'input';

    if (type === 'big')
      inputStyles = 'input-big';

    if (type === 'readOnly') {
      inputStyles = 'input input-readOnly';
    }

    let iconEl;
    if (icon) {
      iconEl = (
        <div onClick={onIconClick} styleName={icon}><IconsComponent icon={icon} /></div>
      );
    }

    return (
      <div styleName="InputControl">
        {iconEl}
        <input type="text"
               styleName={inputStyles}
               icon={icon}
               value={inputValue}
               autoFocus={autoFocus}
               placeholder={inputPlaceholder}
               onChange={onChange}
               onKeyDown={onKeyDown}
               readOnly={readOnly}
               ref={inputRef} />
        <label styleName="label"> {label} </label>
      </div>
    );
  }
}
