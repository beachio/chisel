import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Notification.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Notification extends Component {
  onConfirm = () => {
    const {onConfirm} = this.props.notification;
    if (onConfirm)
      onConfirm();
    this.onCancel();
  };

  onCancel = () => {
    this.props.closeNotification();
  };

  render() {
    const {notification} = this.props;
    const {text, confirmLabel, cancelLabel} = notification;

    return (
      <div styleName="Notification">
        <div>{text}</div>
        {confirmLabel &&
          <button styleName="button" onClick={this.onConfirm}>{confirmLabel}</button>
        }
        <button styleName="button" onClick={this.onCancel}>{cancelLabel}</button>
      </div>
    );
  }
}
