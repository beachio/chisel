import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './AlertModal.sss';


export const ALERT_TYPE_ALERT = "modals/alert/ALERT_TYPE_ALERT";
export const ALERT_TYPE_CONFIRM = "modals/alert/ALERT_TYPE_CONFIRM";


@CSSModules(styles, {allowMultiple: true})
export default class AlertModal extends Component {
  type = ALERT_TYPE_ALERT;
  
  componentDidMount() {
    document.onkeydown = this.onKeyPress;
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  onKeyPress = event => {
    event = event || window.event;
    //Enter or Esc pressed
    if (event.keyCode == 13 || event.keyCode == 27)
      setTimeout(this.props.onClose, 1);
  };
  
  onConfirm = () => {
    const {onClose} = this.props;
    const {onConfirm} = this.props.params;
    onConfirm();
    onClose();
  };

  render() {
    const {onClose} = this.props;
    
    const {title, description, type, onConfirm} = this.props.params;
    if (type)
      this.type = type;

    return (
      <div styleName="Modal" onKeyPress={this.onKeyPress}>
        <div styleName="bg" onClick={onClose}></div>

        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">
              {title || ''}
            </div>
          </div>

          <div styleName="content">
            <div styleName="description">
              {description || ''}
            </div>
            {
              this.type == ALERT_TYPE_ALERT &&
                <div styleName="button">
                  <ButtonControl type="green"
                                 value="OK"
                                 onClick={onClose} />
                </div>
            }
            {
              this.type == ALERT_TYPE_CONFIRM &&
                <div styleName="buttons-wrapper">
                  <div styleName="buttons-inner">
                    <ButtonControl type="red"
                                   value="Yes"
                                   onClick={this.onConfirm} />
                  </div>
                  <div styleName="buttons-inner">
                    <ButtonControl type="gray"
                                   value="No"
                                   onClick={onClose} />
                  </div>
                </div>
            }
          </div>

        </div>
      </div>
    );
  }
}
