import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';

import styles from './AIPromptModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class AIPromptModal extends Component {
  state = {
    prompt: ''
  };

  active = false;
  focusElm = null;
  focusBtn = null;


  componentDidMount() {
    this.active = true;
    document.addEventListener('keydown', this.onKeyDown);

    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
    else if (this.focusBtn)
      setTimeout(() => this.focusBtn.focus(), 2);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();

    //Enter or Esc pressed
    /*if (event.keyCode == 13)
      setTimeout(this.onConfirm, 1);
    else*/ if (event.keyCode == 27)
      setTimeout(this.onCancel, 1);
  };

  onChangePrompt = event => {
    this.setState({prompt: event.target.value});
  };

  onConfirm = () => {
    if (!this.active)
      return;

    this.props.params.complete(this.state.prompt);
    this.close();
  };

  onCancel = () => {
    this.close();
  }

  close = () => {
    this.active = false;
    this.props.onClose();
  };

  render() {
    return (
      <div styleName="Modal" onClick={this.onCancel}>

        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="modal-header">
            <div styleName="title">AI Completion</div>
          </div>

          <div styleName="content">
            <div styleName="description">Type the prompt.</div>
            <div styleName="input-wrapper">
              <textarea styleName="textarea"
                        onChange={this.onChangePrompt}
                        ref={inp => this.focusElm = inp}
                        value={this.state.prompt} />
            </div>

            <div styleName="buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="red"
                               value="OK"
                               DOMRef={btn => this.focusBtn = btn}
                               onClick={this.onConfirm} />
              </div>
              <div styleName="buttons-inner">
                <ButtonControl color="gray"
                               value="Cancel"
                               onClick={this.onCancel} />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
