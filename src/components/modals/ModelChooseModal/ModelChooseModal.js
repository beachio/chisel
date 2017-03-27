import React, {Component, PropTypes} from 'react';
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
  
  
  componentWillMount() {
    this.callback = this.props.params.callback;
    this.onClose = this.props.onClose;
    
    this.models = this.props.models;
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
  
  render() {
    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">Please, select model for new item</div>
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
