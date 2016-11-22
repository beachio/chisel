import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './ButtonControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ButtonControl extends Component {
  render() {
    let {value, color, onClick, type, disabled} = this.props;
    if (!type)
      type = 'button';

    let buttonControlClasses = classNames({
      'ButtonControl': true,
      'ButtonControl-red': color === 'red',
      'ButtonControl-green': color === 'green',
      'ButtonControl-gray': color === 'gray'
    });
    
    if (disabled) {
      onClick = null;
      buttonControlClasses = classNames({
        'ButtonControl': true,
        'ButtonControl-disabled': true
      });
    }

    return (
      <button styleName={buttonControlClasses} onClick={onClick} type={type}>
        {value || 'Clear'}
      </button>
    );
  }
}
