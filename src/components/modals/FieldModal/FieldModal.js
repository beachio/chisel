import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import CheckboxControl from 'components/elements/CheckboxControl/CheckboxControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import InputControl from 'components/elements/InputControl/InputControl';
import ValidationNumber from 'components/modals/FieldModal/Validations/ValidationNumber';
import ValidationString from 'components/modals/FieldModal/Validations/ValidationString';
import ValidationReference from 'components/modals/FieldModal/Validations/ValidationReference';
import {removeOddSpaces} from "utils/common";
import {getNameId, checkFieldName, NAME_ERROR_NAME_EXIST} from 'utils/data';

import {FIELD_TYPES, canBeList, canBeTitle} from 'models/ModelData';
import * as ftps from 'models/ModelData';

import styles from './FieldModal.sss';


const TAB_SETTINGS = 'TAB_SETTINGS';
const TAB_VALIDATIONS = 'TAB_VALIDATIONS';


@CSSModules(styles, {allowMultiple: true})
export default class FieldModal extends Component {
  state = {
    name: '',
    nameId: '',
    type: '',
    appearance: '',
    isRequired: false,
    isTitle: false,
    isList: false,
    isDisabled: false,

    error: null,

    appList: [],
    
    tab: TAB_SETTINGS
  };
  
  active = false;
  typeList = Array.from(FIELD_TYPES.keys());
  field = null;
  updating = false;
  validations = null;
  models = null;


  constructor(props) {
    super(props);
    
    this.models = props.models;
    
    this.field = props.params;
    this.updating = !!this.field.origin;
    
    this.state.name       = this.field.name;
    this.state.nameId     = this.field.nameId;
    this.state.type       = this.field.type;
    this.state.appearance = this.field.appearance;
    this.state.isRequired = this.field.isRequired;
    this.state.isTitle    = this.field.isTitle;
    this.state.isList     = this.field.isList;
    this.state.isDisabled = this.field.isDisabled;
    
    this.validations = this.field.validations;
    this.state.appList    = FIELD_TYPES.get(this.field.type);

    if (!this.updating && canBeTitle(this.state) && !this.field.model.hasTitle())
      this.state.isTitle = true;
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
      setTimeout(this.onSave, 1);
    else if (event.keyCode == 27)
      setTimeout(this.close, 1);
  };

  onChangeName = event => {
    let name = event.target.value;
    let nameId = this.state.nameId;
    if (!this.updating)
      nameId = getNameId(name, this.field.model.fields);

    this.setState({name, nameId, error: null});
  };

  onChangeType = type => {
    this.setState({
      type,
      appList: FIELD_TYPES.get(type),
      appearance: FIELD_TYPES.get(type)[0]
    }, this.checkSwitches);
  };

  onChangeAppearance = appearance => {
    this.setState({appearance}, this.checkSwitches);
  };

  onChangeIsTitle = isTitle => {
    this.setState({isTitle, isRequired: isTitle});
  };
  
  onChangeIsList = isList => {
    this.setState({isList}, this.checkSwitches);
  };

  onChangeIsDisabled = isDisabled => {
    this.setState({isDisabled}, this.checkSwitches);
  };
  
  onChangeIsRequired = isRequired => {
    this.setState({isRequired});
  };

  onSave = () => {
    if (!this.active)
      return;
    
    if (!this.state.name) {
      this.close();
      return;
    }

    if (this.field.name != this.state.name) {
      const name = removeOddSpaces(this.state.name);
      let error = checkFieldName(name);
      if (error) {
        this.setState({error});
        return;
      }
      this.field.name = name;
    }
    
    this.field.type       = this.state.type;
    this.field.appearance = this.state.appearance;
    this.field.isRequired = this.state.isRequired;
    this.field.isTitle    = this.state.isTitle;
    this.field.isList     = this.state.isList;
    this.field.isDisabled = this.state.isDisabled;
  
    this.field.validations = this.validations;

    const {addField, updateField} = this.props;
    if (this.updating)
      updateField(this.field);
    else
      addField(this.field);
    this.close();
  };

  close = () => {
    this.active = false;
    this.props.onClose();
  };

  checkSwitches() {
    let can = canBeTitle(this.state);
    if (can && !this.field.model.hasTitle())
      this.setState({isTitle: true});
    if (!can && this.state.isTitle)
      this.setState({isTitle: false});
  
    if (!canBeList(this.state))
      this.setState({isList: false});
  }
  
  onUpdateValidations = validations => {
    this.validations = validations;
  };

  render() {
    let headName = this.state.name.length ? this.state.name : '?';
    
    let tabSettStyle = 'tab';
    let tabValidStyle = 'tab';
    let content = null;
    switch (this.state.tab) {
      case TAB_SETTINGS:
        tabSettStyle += ' active';
        
        content = (
          <div>
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
    
            <div styleName="input-wrapper">
              <InputControl label="Field ID"
                            icon="lock"
                            value={this.state.nameId}
                            readOnly={true} />
            </div>
    
            <div styleName="input-wrapper">
              <DropdownControl label="Type"
                               disabled={this.updating || this.state.isTitle}
                               suggestionsList={this.typeList}
                               suggest={this.onChangeType}
                               current={this.state.type} />
            </div>
    
            <div styleName="input-wrapper">
              <DropdownControl label="Appearance"
                               disabled={this.state.isTitle}
                               suggestionsList={this.state.appList}
                               suggest={this.onChangeAppearance}
                               current={this.state.appearance} />
            </div>
    
            <div styleName="input-wrapper">
              <SwitchControl label="List (keeping multiple values instead of one)"
                             checked={this.state.isList}
                             onChange={this.onChangeIsList}
                             disabled={!canBeList(this.state) || this.updating} />
            </div>
    
            <div styleName="input-wrapper">
              <SwitchControl label="Entry Title"
                             checked={this.state.isTitle}
                             onChange={this.onChangeIsTitle}
                             disabled={!canBeTitle(this.state)} />
            </div>
    
            <div styleName="input-wrapper">
              <SwitchControl label="Disabled"
                             checked={this.state.isDisabled}
                             onChange={this.onChangeIsDisabled}
                             disabled={this.state.isTitle} />
            </div>
          </div>
        );
        
        break;
        
      case TAB_VALIDATIONS:
        tabValidStyle += ' active';
  
        let validations = null;
        switch (this.state.type) {
          case ftps.FIELD_TYPE_SHORT_TEXT:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
              case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
                validations = <ValidationString validations={this.validations}
                                                update={this.onUpdateValidations} />;
                break;
            }
            break;
  
          case ftps.FIELD_TYPE_LONG_TEXT:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
              case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
                validations = <ValidationString validations={this.validations}
                                                update={this.onUpdateValidations} />;
                break;
            }
            break;
  
          case ftps.FIELD_TYPE_INTEGER:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
                validations = <ValidationNumber validations={this.validations}
                                                update={this.onUpdateValidations }/>;
                break;
  
              case ftps.FIELD_APPEARANCE__INTEGER__RATING:
                break;
            }
            break;
  
          case ftps.FIELD_TYPE_FLOAT:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
                validations = <ValidationNumber validations={this.validations}
                                                update={this.onUpdateValidations} />;
                break;
            }
            break;
          
          case ftps.FIELD_TYPE_REFERENCE:
            validations = <ValidationReference validations={this.validations}
                                               models={this.models}
                                               update={this.onUpdateValidations} />;
            break;
        }
        
        content = (
          <div>
            <div styleName="input-wrapper">
              <div styleName="switch">
                <CheckboxControl title="Required"
                                 checked={this.state.isRequired}
                                 onChange={this.onChangeIsRequired}
                                 disabled={this.state.isTitle} />
              </div>
            </div>
            {validations}
          </div>
        );
        
        break;
    }

    return (
      <div styleName="modal" onClick={this.close}>

        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="modal-header">
            <div styleName="titles">
              <div styleName="title">{headName}</div>
              <div styleName="subtitle">{this.state.type} — {this.state.appearance}</div>
            </div>
            <div styleName="tabs">
              <div styleName={tabSettStyle}   onClick={() => this.setState({tab: TAB_SETTINGS})}    >Settings</div>
              <div styleName={tabValidStyle}  onClick={() => this.setState({tab: TAB_VALIDATIONS})} >Validations</div>
            </div>
          </div>
          <div styleName="content">
            <form>
              {content}
              <div styleName="input-wrapper buttons-wrapper">
                <div styleName="buttons-inner">
                  <ButtonControl color="green"
                                 value="Save"
                                 onClick={this.onSave} />
                </div>
                <div styleName="buttons-inner">
                  <ButtonControl color="gray"
                                 value="Cancel"
                                 onClick={this.close} />
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}
