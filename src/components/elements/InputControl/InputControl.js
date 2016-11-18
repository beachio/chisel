import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './InputControl.sss';

@CSSModules(styles, {allowMultiple: true})
export default class InputControl extends Component {
  render() {
    const { label, type, value, placeholder, onChange, readOnly, autoFocus, onKeyDown } = this.props;
    let inputValue = value;
    let inputPlaceholder = placeholder;

    let inputStyles = 'input';

    if (type === 'big')
      inputStyles = 'input-big';

    if (type === 'readOnly')
      inputStyles = 'input input-readOnly';

    return (
      <div styleName="InputControl">
        {
          type === 'readOnly' ? <InlineSVG styleName="lock" src={require("./lock.svg")} /> : ''
        }
        <input type="text"
               styleName={inputStyles}
               value={ inputValue }
               autoFocus={autoFocus}
               placeholder={ inputPlaceholder }
               onChange={ onChange }
               onKeyDown={ onKeyDown }
               readOnly={ readOnly } />
        <label styleName="label"> {label} </label>
      </div>
    );
  }
}
