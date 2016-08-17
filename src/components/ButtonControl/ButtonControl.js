import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './ButtonControl.sss';

@CSSModules(styles, {allowMultiple: true})
export default class ButtonControl extends Component {
  render() {
    const {value, type} = this.props;

    let buttonControlClasses = classNames({
      'ButtonControl': true,
      'ButtonControl-green': type === 'green',
      'ButtonControl-gray': type === 'gray'
    });

    return (
      <div styleName={buttonControlClasses}>
        {value || 'Clear'}
      </div>
    );
  }
}
