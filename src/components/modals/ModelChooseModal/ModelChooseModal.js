import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './ModelChooseModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ModelChooseModal extends Component {
  state = {
    selectedModel: null,
  };
  
  models = [];
  focusElm = null;
  active = false;
  
  
  constructor(props) {
    super(props);
    
    const {validModels} = props.params;
    if (validModels)
      this.models = props.models.filter(
        model => validModels.indexOf(model.nameId) != -1);
    else
      this.models = props.models;
  }
  
  componentDidMount() {
    this.active = true;
    document.addEventListener('keydown', this.onKeyDown);
    
    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }
  
  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();
    
    //Enter or Esc pressed
    if (event.keyCode == 13)
      setTimeout(this.onChoose, 1);
    else if (event.keyCode == 27)
      setTimeout(this.close, 1);
  };
  
  onSelect = model => {
    this.setState({selectedModel: model});
  };
  
  onChoose = () => {
    if (!this.state.selectedModel || !this.active)
      return;
    
    this.props.params.callback(this.state.selectedModel);
    this.close();
  };

  close = () => {
    this.active = false;
    this.props.onClose();
  };

  render() {
    return (
      <div styleName="modal" onClick={this.close}>

        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="modal-header">
            <div styleName="title">Select model for new item</div>
          </div>
          <div styleName="content">
            <div styleName="model">
              {this.models
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
                               onClick={this.close} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
