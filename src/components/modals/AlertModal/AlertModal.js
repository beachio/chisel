import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';

import styles from './AlertModal.sss';


export const ALERT_TYPE_ALERT = "modals/alert/ALERT_TYPE_ALERT";
export const ALERT_TYPE_CONFIRM = "modals/alert/ALERT_TYPE_CONFIRM";


@CSSModules(styles, {allowMultiple: true})
export default class AlertModal extends Component {
  state = {
    confirmString: ''
  };
  type = ALERT_TYPE_ALERT;
  confirmString = '';
  
  
  componentWillMount() {
    if (this.props.params.confirmString)
      this.confirmString = this.props.params.confirmString;
  }
  
  componentDidMount() {
    document.onkeydown = this.onKeyPress;
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  onKeyPress = event => {
    event = event || window.event;
    
    //Enter or Esc pressed
    if (event.keyCode == 13)
      setTimeout(this.onConfirm, 1);
    else if (event.keyCode == 27)
      setTimeout(this.props.onClose, 1);
  };
  
  onChangeString = event => {
    let confirmString = event.target.value;
    
    this.setState({confirmString});
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
  
    let descriptionHTML = {__html: description || ''};

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
            <div styleName="description" dangerouslySetInnerHTML={descriptionHTML}>
            </div>
            {
              this.confirmString &&
                <div styleName="input-wrapper">
                  <InputControl onChange={this.onChangeString}
                                value={this.state.confirmString} />
                </div>
            }
            {
              this.type == ALERT_TYPE_ALERT &&
                <div styleName="button">
                  <ButtonControl color="green"
                                 value="OK"
                                 onClick={onClose} />
                </div>
            }
            {
              this.type == ALERT_TYPE_CONFIRM &&
                <div styleName="buttons-wrapper">
                  <div styleName="buttons-inner">
                    <ButtonControl color="red"
                                   value="Yes"
                                   disabled={this.confirmString != this.state.confirmString}
                                   onClick={this.onConfirm} />
                  </div>
                  <div styleName="buttons-inner">
                    <ButtonControl color="gray"
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
