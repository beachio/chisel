import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {removeSpaces, filterSpecials} from 'utils/common';
import {checkFieldName, NAME_ERROR_NAME_EXIST, NAME_ERROR_NAME_RESERVED} from 'utils/data';
import {FIELD_TYPES, FIELD_TYPE_SHORT_TEXT} from 'models/ModelData';

import styles from './FieldModal.sss';



@CSSModules(styles, {allowMultiple: true})
export default class FieldModal extends Component {
  state = {
    name: '',
    nameId: '',
    type: '',
    appearance: '',
    isTitle: '',

    error: null,
  
    appList: []
  };
  typeList = Array.from(FIELD_TYPES.keys());
  field = null;
  onClose = null;


  componentWillMount() {
    this.field = this.props.params;
    this.onClose = this.props.onClose;
    this.setState({
      name:       this.field.name,
      nameId:     this.field.nameId,
      type:       this.field.type,
      appearance: this.field.appearance,
      isTitle:    this.field.isTitle,
  
      appList:    FIELD_TYPES.get(this.field.type)
    });
  }

  onChangeName = event => {
    let name = event.target.value;
    let nameId = filterSpecials(removeSpaces(name));

    this.setState({name, nameId, error: null});
  };

  onChangeType = type => {
    this.setState({type, appList: FIELD_TYPES.get(type)});
  };
  
  onChangeAppearance = appearance => {
    this.setState({appearance});
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

    if (this.field.name != this.state.name) {
      let error = checkFieldName(this.state.name);
      if (error) {
        this.setState({error});
        return;
      }
    }

    this.field.name       = this.state.name;
    this.field.nameId     = this.state.nameId;
    this.field.type       = this.state.type;
    this.field.appearance = this.state.appearance;
    this.field.isTitle    = this.state.isTitle;

    this.props.updateField(this.field);
    this.onClose();
  };

  render() {
    let headName = this.state.name.length ? this.state.name : '?';
    
    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">{headName}</div>
            <div styleName="subtitle">{this.state.type} — {this.state.appearance}</div>
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
                this.state.error == NAME_ERROR_NAME_EXIST &&
                  <div styleName="error-same-name">This name is already in use.</div>
              }
              {
                this.state.error == NAME_ERROR_NAME_RESERVED &&
                  <div styleName="error-same-name">This name is reserved.</div>
              }

              <div styleName="input-wrapper">
                <InputControl label="Field ID"
                              placeholder="main_title"
                              type="readOnly"
                              value={this.state.nameId}
                              readOnly="readOnly" />
              </div>

              <DropdownControl label="Type"
                               suggestionsList={this.typeList}
                               suggest={this.onChangeType}
                               current={this.state.type} />
  
              <DropdownControl label="Appearance"
                               suggestionsList={this.state.appList}
                               suggest={this.onChangeAppearance}
                               current={this.state.appearance} />
  
              {
                this.state.type == FIELD_TYPE_SHORT_TEXT &&
                  <div styleName="input-wrapper">
                    <div styleName="label">Entry Title</div>
                    <div styleName="switch">
                      <SwitchControl checked={this.state.isTitle} onChange={this.onChangeIsTitle}/>
                    </div>
                  </div>
              }

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
