import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './ButtonControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ButtonControl extends Component {
  render() {
    let {value, color, onClick, type, disabled, DOMRef, showLoader} = this.props;
    if (!type)
      type = 'button';

    let buttonControlClasses = classNames({
      'ButtonControl': true,
      'ButtonControl-red':    color === 'red',
      'ButtonControl-green':  color === 'green',
      'ButtonControl-gray':   color === 'gray',
      'ButtonControl-purple': color === 'purple',
      'ButtonControl-black':  color === 'black',
    });
    
    if (disabled) {
      onClick = null;
      buttonControlClasses = classNames({
        'ButtonControl': true,
        'ButtonControl-disabled': true
      });
    }

    return (
      <button styleName={buttonControlClasses}
              onClick={onClick}
              type={type}
              ref={DOMRef}>
        {value || 'Clear'}
        {showLoader &&
          <div styleName="loader-wrapper">
            <LoaderComponent/>
          </div>
        }
      </button>
    );
  }
}
