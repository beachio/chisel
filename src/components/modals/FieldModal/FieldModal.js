import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {getNameId, checkFieldName, NAME_ERROR_NAME_EXIST, NAME_ERROR_NAME_RESERVED} from 'utils/data';
import {FIELD_TYPES, canBeList, canBeTitle} from 'models/ModelData';

import styles from './FieldModal.sss';



@CSSModules(styles, {allowMultiple: true})
export default class FieldModal extends Component {
  state = {
    name: '',
    nameId: '',
    type: '',
    appearance: '',
    isTitle: '',
    isList: false,

    error: null,

    appList: []
  };
  
  active = false;
  typeList = Array.from(FIELD_TYPES.keys());
  field = null;
  updating = false;
  onClose = null;


  componentWillMount() {
    this.field = this.props.params;
    this.updating = !!this.field.origin;
    this.onClose = this.props.onClose;
    
    this.setState({
      name:       this.field.name,
      nameId:     this.field.nameId,
      type:       this.field.type,
      appearance: this.field.appearance,
      isTitle:    this.field.isTitle,
      isList:     this.field.isList,

      appList:    FIELD_TYPES.get(this.field.type)
    });
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
      setTimeout(this.onSave, 1);
    else if (event.keyCode == 27)
      setTimeout(this.props.onClose, 1);
  };

  onChangeName = event => {
    let name = event.target.value;
    let nameId = this.state.nameId;
    if (!this.updating)
      nameId = getNameId(name, this.props.fields);

    this.setState({name, nameId, error: null});
  };

  onChangeType = type => {
    this.setState({
      type,
      appList: FIELD_TYPES.get(type),
      appearance: FIELD_TYPES.get(type)[0]
    });
  };

  onChangeAppearance = appearance => {
    this.setState({appearance});
  };

  onChangeIsTitle = isTitle => {
    this.setState({isTitle});
  };
  
  onChangeIsList = isList => {
    this.setState({isList});
  };

  onSave = () => {
    if (!this.active)
      return;
    
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
    this.field.type       = this.state.type;
    this.field.appearance = this.state.appearance;
    this.field.isTitle    = this.state.isTitle;
    this.field.isList     = this.state.isList;

    const {addField, updateField} = this.props;
    if (this.updating)
      updateField(this.field);
    else
      addField(this.field);
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
                              DOMRef={inp => this.focusElm = inp}
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
                              icon="lock"
                              value={this.state.nameId}
                              readOnly={true} />
              </div>

              <div styleName="input-wrapper">
                {
                  this.updating ?
                    <InputControl label="Type"
                                  icon="lock"
                                  value={this.state.type}
                                  readOnly={true} />
                  :
                    <DropdownControl label="Type"
                                     suggestionsList={this.typeList}
                                     suggest={this.onChangeType}
                                     current={this.state.type} />
                }
                
              </div>

              <div styleName="input-wrapper">
                <DropdownControl label="Appearance"
                                 suggestionsList={this.state.appList}
                                 suggest={this.onChangeAppearance}
                                 current={this.state.appearance} />
              </div>

              {
                canBeList(this.state) &&
                  <div styleName="input-wrapper">
                    <div styleName="label">List (keeping multiple values instead of one)</div>
                    <div styleName="switch">
                      <SwitchControl checked={this.state.isList}
                                     onChange={this.onChangeIsList}
                                     disabled={this.state.isTitle || this.updating} />
                    </div>
                  </div>
              }
              
              {
                canBeTitle(this.state) &&
                  <div styleName="input-wrapper">
                    <div styleName="label">Entry Title</div>
                    <div styleName="switch">
                      <SwitchControl checked={this.state.isTitle}
                                     onChange={this.onChangeIsTitle}
                                     disabled={this.state.isList} />
                    </div>
                  </div>
              }

              <div styleName="input-wrapper buttons-wrapper">
                <div styleName="buttons-inner">
                  <ButtonControl color="green"
                                 value="Save"
                                 onClick={this.onSave} />
                </div>
                <div styleName="buttons-inner">
                  <ButtonControl color="gray"
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
