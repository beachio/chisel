import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {removeSpaces, filterSpecials} from 'utils/common';
import {checkFieldName} from 'utils/data';
import {FIELD_TYPES} from 'models/ModelData';

import styles from './FieldModal.sss';


const ERROR_TYPE_SAME_NAME = "ERROR_TYPE_SAME_NAME";


@CSSModules(styles, {allowMultiple: true})
export default class FieldModal extends Component {
  state = {
    name: '',
    nameId: '',
    type: '',
    isTitle: '',

    error: null
  };
  field = null;
  onClose = null;


  componentWillMount() {
    this.field = this.props.params;
    this.onClose = this.props.onClose;
    this.setState({
      name:     this.field.name,
      nameId:   this.field.nameId,
      type:     this.field.type,
      isTitle:  this.field.isTitle
    });
  }

  onChangeName = event => {
    let name = event.target.value;
    let nameId = filterSpecials(removeSpaces(name));

    this.setState({name, nameId, error: null});
  };

  onChangeType = type => {
    this.setState({type});
  };

  onChangeIsTitle = event => {
    let isTitle = event.target.checked;
    this.setState({isTitle});
  };

  onSave = () => {
    if (!this.state.name) {
      this.onClose();
      return;
    }

    if (this.field.name != this.state.name && !checkFieldName(this.state.name)) {
      this.setState({error: ERROR_TYPE_SAME_NAME});
      return;
    }

    this.field.name     = this.state.name;
    this.field.nameId   = this.state.nameId;
    this.field.type     = this.state.type;
    this.field.isTitle  = this.state.isTitle;

    this.props.updateField(this.field);
    this.onClose();
  };

  render() {
    let suggestionsList = FIELD_TYPES;

    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">{this.field.name}</div>
            <div styleName="subtitle">{this.field.type}</div>
          </div>
          <div styleName="content">
            <form>
              <div styleName="input-wrapper">
                <InputControl label="Name"
                              placeholder="Main Title"
                              onChange={this.onChangeName}
                              value={this.state.name} />
              </div>

              {
                this.state.error == ERROR_TYPE_SAME_NAME &&
                  <div styleName="error-same-name">This name is already in use.</div>
              }

              <div styleName="input-wrapper">
                <InputControl label="Field ID"
                              placeholder="main_title"
                              type="readOnly"
                              value={this.state.nameId}
                              readOnly="readOnly" />
              </div>

              <DropdownControl 
                               label="Type"
                               suggestionsList={suggestionsList}
                               suggest={this.onChangeType}
                               current={this.state.type} />

              <div styleName="input-wrapper">
                <div styleName="label">Entry Title</div>
                <div styleName="switch">
                  <SwitchControl checked={this.state.isTitle} onChange={this.onChangeIsTitle} />
                </div>
              </div>

              <div styleName="input-wrapper buttons-wrapper">
                <div styleName="buttons-inner">
                  <ButtonControl type="green"
                                 value="Save"
                                 onClick={this.onSave} />
                </div>
                <div styleName="buttons-inner">
                  <ButtonControl type="gray"
                                 value="Cancel"
                                 onClick={this.onClose} />
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}
