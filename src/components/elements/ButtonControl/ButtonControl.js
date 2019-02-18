import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './ButtonControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ButtonControl extends Component {
  render() {
    let {value, color, onClick, type, disabled, DOMRef, showLoader} = this.props;
    if (!type)
      type = 'button';

    let buttonControlClasses = 'ButtonControl';
    if (disabled) {
      onClick = null;
      buttonControlClasses += ' ButtonControl-disabled';
    } else if (color) {
      buttonControlClasses += ' ButtonControl-' + color;
    }

    return (
      <button styleName={buttonControlClasses}
              onClick={onClick}
              type={type}
              ref={DOMRef}>
        {value}
        {showLoader &&
          <div styleName="loader-wrapper">
            <LoaderComponent/>
          </div>
        }
      </button>
    );
  }
}
