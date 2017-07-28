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
  
  active = false;
  type = ALERT_TYPE_ALERT;
  confirmString = '';
  focusElm = null;
  focusBtn = null;
  
  
  constructor(props) {
    super(props);
    
    if (props.params.confirmString)
      this.confirmString = props.params.confirmString;
  }
  
  componentDidMount() {
    this.active = true;
    document.onkeydown = this.onKeyPress;
  
    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
    else if (this.focusBtn)
      setTimeout(() => this.focusBtn.focus(), 2);
  }

  componentWillUnmount() {
    document.onkeydown = null;
    this.active = false;
  }

  onKeyPress = () => {
    let event = window.event;
    event.stopPropagation();
    
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
    if (!this.active)
      return;
    
    const {onClose} = this.props;
    
    if (this.type == ALERT_TYPE_CONFIRM) {
      if (this.confirmString == this.state.confirmString) {
        this.props.params.onConfirm();
        onClose();
      }
    } else  {
      onClose();
    }
  };

  render() {
    const {onClose} = this.props;
    
    const {title, description, type} = this.props.params;
    if (type)
      this.type = type;

    let titleHTML = {__html: title || ''};
    let descriptionHTML = {__html: description || ''};

    return (
      <div styleName="Modal">
        <div styleName="bg" onClick={onClose}></div>

        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title" dangerouslySetInnerHTML={titleHTML}>
            </div>
          </div>

          <div styleName="content">
            <div styleName="description" dangerouslySetInnerHTML={descriptionHTML}>
            </div>
            {
              this.confirmString &&
                <div styleName="input-wrapper">
                  <InputControl onChange={this.onChangeString}
                                DOMRef={inp => this.focusElm = inp}
                                value={this.state.confirmString} />
                </div>
            }
            {
              this.type == ALERT_TYPE_ALERT &&
                <div styleName="button">
                  <ButtonControl color="green"
                                 value="OK"
                                 DOMRef={btn => this.focusBtn = btn}
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
                                   DOMRef={btn => this.focusBtn = btn}
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
