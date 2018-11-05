import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {checkSiteName, NAME_ERROR_NAME_EXIST} from "utils/data";
import {removeOddSpaces} from "utils/common";

import styles from './SiteCreationModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SiteCreationModal extends Component {
  state = {
    name: '',
    template: null,
    errorName: false
  };
  site = null;
  active = false;
  focusElm = null;
  
  
  constructor(props) {
    super(props);
    
    this.site = props.params;
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
  
  onChangeName = event => {
    let name = event.target.value;
    this.setState({name, errorName: null});
  };
  
  onChoose = () => {
    if (!this.state.name || !this.active)
      return;
  
    const name = removeOddSpaces(this.state.name);
    const error = checkSiteName(name);
    if (error == NAME_ERROR_NAME_EXIST) {
      this.setState({errorName: true});
      return;
    }
    this.site.name = name;
  
    this.props.addSite(this.site);
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
            <div styleName="title">Creating site</div>
          </div>
          <div styleName="content">
            <div styleName="input-wrapper">
              <InputControl label="Site name"
                            DOMRef={inp => this.focusElm = inp}
                            onChange={this.onChangeName}
                            value={this.state.name} />
            </div>
            
            {this.state.errorName &&
              <div styleName="error-same-name">This name is already in use.</div>
            }
            
            <div styleName="input-wrapper buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="green"
                               value="Choose"
                               //disabled={!this.state.template}
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
