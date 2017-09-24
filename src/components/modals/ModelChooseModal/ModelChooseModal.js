import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';

import styles from './ModelChooseModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ModelChooseModal extends Component {
  state = {
    selectedModel: null,
  };
  
  isMult = false;
  onClose = null;
  callback = null;
  models = [];
  focusElm = null;
  active = false;
  
  
  constructor(props) {
    super(props);
    
    this.callback = props.params.callback;
    this.onClose = props.onClose;
    
    this.models = props.models;
  }
  
  componentDidMount() {
    this.active = true;
    document.onkeydown = this.onKeyPress;
    
    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
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
      setTimeout(this.onChoose, 1);
    else if (event.keyCode == 27)
      setTimeout(this.props.onClose, 1);
  };
  
  onSelect = model => {
    this.setState({selectedModel: model});
  };
  
  onChoose = () => {
    if (!this.state.selectedModel || !this.active)
      return;
    
    this.callback(this.state.selectedModel);
    this.onClose();
  };
  
  rejectClick = false;
  onClickInner = () => {
    this.rejectClick = true;
  };
  onClickBg = () => {
    if (!this.rejectClick)
      this.onClose();
    this.rejectClick = false;
  };

  render() {
    return (
      <div styleName="modal" onClick={this.onClickBg}>

        <div styleName="modal-inner" onClick={this.onClickInner}>
          <div styleName="modal-header">
            <div styleName="title">Select model for new item</div>
          </div>
          <div styleName="content">
            <div styleName="model">
              {
                this.models
                  .map(model => {
                    let style = "model-item";
                    if (this.state.selectedModel == model)
                      style += " model-chosen";
                    
                    return (
                      <div styleName={style}
                           key={model.origin.id}
                           onClick={() => this.onSelect(model)}>
                        {model.name}
                      </div>
                    );
                  })
              }
            </div>
            
            <div styleName="input-wrapper buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="green"
                               value="Choose"
                               disabled={!this.state.selectedModel}
                               onClick={this.onChoose} />
              </div>
              <div styleName="buttons-inner">
                <ButtonControl color="gray"
                               value="Cancel"
                               onClick={this.onClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
