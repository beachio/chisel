import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import classNames from "classnames";

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import CheckboxControl from 'components/elements/CheckboxControl/CheckboxControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import InputControl from 'components/elements/InputControl/InputControl';
import DynamicListComponent from 'components/elements/DynamicListComponent/DynamicListComponent';
import ValidationNumber from 'components/modals/FieldModal/Validations/ValidationNumber';
import ValidationString from 'components/modals/FieldModal/Validations/ValidationString';
import ValidationDate from 'components/modals/FieldModal/Validations/ValidationDate';
import ValidationReference from 'components/modals/FieldModal/Validations/ValidationReference';
import ValidationMedia from "components/modals/FieldModal/Validations/ValidationMedia";
import {BYTES, convertDataUnits, throttle} from "utils/common";
import {removeOddSpaces} from "utils/strings";
import {getNameId, checkFieldName, NAME_ERROR_NAME_EXIST} from 'utils/data';

import {FIELD_TYPES, canBeList, canBeTitle, canBeUnique} from 'models/ModelData';
import * as ftps from 'models/ModelData';

import styles from './FieldModal.sss';


const TAB_SETTINGS = 'TAB_SETTINGS';
const TAB_APPEARANCE = 'TAB_APPEARANCE';
const TAB_VALIDATIONS = 'TAB_VALIDATIONS';


@CSSModules(styles, {allowMultiple: true})
export default class FieldModal extends Component {
  field = this.props.params;

  state = {
    name:         this.field.name,
    nameId:       this.field.nameId,
    type:         this.field.type,
    appearance:   this.field.appearance,
    boolTextYes:  this.field.boolTextYes,
    boolTextNo:   this.field.boolTextNo,
    validValues:  this.field.validValues,
    isRequired:   this.field.isRequired,
    isTitle:      this.field.isTitle,
    isList:       this.field.isList,
    isDisabled:   this.field.isDisabled,
    isUnique:     this.field.isUnique,

    errorName: false,

    appList: FIELD_TYPES.get(this.field.type),

    tab: TAB_SETTINGS
  };

  active = false;
  typeList = Array.from(FIELD_TYPES.keys());
  updating = !!this.field.origin;
  validations = this.field.validations;
  validValuesList = null;
  focusElm = null;

  tabRef = null;
  caretRef = null;


  constructor(props) {
    super(props);

    if (!this.updating && canBeTitle(this.state) && !this.field.model.getTitle()) {
      this.state.isTitle = true;
      this.state.isRequired = true;
    }
  }

  componentDidMount() {
    this.active = true;
    document.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('resize', this.onResize);

    this.calcCaretPos();

    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    throttle(this.calcCaretPos, 500)();
  };

  onKeyDown = event => {
    if (this.validValuesList && this.validValuesList.isFocused())
      return;

    if (!event)
      event = window.event;
    event.stopPropagation();

    //Enter pressed
    if (event.keyCode == 13)
      setTimeout(this.onSave, 1);
    //Esc pressed
    else if (event.keyCode == 27)
      setTimeout(this.close, 1);
  };

  onChangeName = name => {
    let nameId = this.state.nameId;
    if (!this.updating)
      nameId = getNameId(name, this.field.model.fields);

    this.setState({name, nameId, errorName: null});
  };

  onChangeType = type => {
    this.setState({
      type,
      appList: FIELD_TYPES.get(type),
      appearance: FIELD_TYPES.get(type)[0]
    }, this.checkControls);
  };

  onChangeBoolTextYes = boolTextYes => {
    this.setState({boolTextYes});
  };

  onChangeBoolTextNo = boolTextNo => {
    this.setState({boolTextNo});
  };

  onChangeAppearance = appearance => {
    this.setState({appearance}, this.checkControls);
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

  onChangeIsUnique = isUnique => {
    this.setState({isUnique});
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
      const error = checkFieldName(name);
      if (error == NAME_ERROR_NAME_EXIST) {
        this.setState({
          tab: TAB_SETTINGS,
          errorName: true
        });
        return;
      }
      this.field.name = name;
    }

    if (this.checkValidErrors()) {
      this.setState({tab: TAB_VALIDATIONS});
      return;
    }

    this.field.type         = this.state.type;
    this.field.appearance   = this.state.appearance;
    this.field.boolTextYes  = this.state.boolTextYes;
    this.field.boolTextNo   = this.state.boolTextNo;
    this.field.isRequired   = this.state.isRequired;
    this.field.isTitle      = this.state.isTitle;
    this.field.isList       = this.state.isList;
    this.field.isDisabled   = this.state.isDisabled;
    this.field.isUnique     = this.state.isUnique;

    let values = this.state.validValues;
    if (values && values.length) {
      const valuesSet = new Set(values);
      values = Array.from(valuesSet);
    }
    this.field.validValues  = values;

    this.field.validations  = this.validations;

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

  checkControls() {
    this.validations = null;
    this.checkSwitches();
  }

  checkSwitches() {
    let can = canBeTitle(this.state);
    if (can && !this.field.model.getTitle())
      this.setState({isTitle: true});
    if (!can && this.state.isTitle)
      this.setState({isTitle: false});

    if (!canBeList(this.state))
      this.setState({isList: false});
  }

  checkValidErrors() {
    if (!this.validations)
      return false;

    let error = false;

    switch (this.state.type) {
      case ftps.FIELD_TYPE_SHORT_TEXT:
        switch (this.state.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            const {range} = this.validations;
            error = range && range.active && range.minActive && range.maxActive && range.min > range.max;
            range.isError = error;
            break;
        }
        break;

      case ftps.FIELD_TYPE_LONG_TEXT:
        switch (this.state.appearance) {
          case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            const {range} = this.validations;
            error = range && range.active && range.minActive && range.maxActive && range.min > range.max;
            range.isError = error;
            break;
        }
        break;

      case ftps.FIELD_TYPE_INTEGER:
        switch (this.state.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
            const {range} = this.validations;
            error = range && range.active && range.minActive && range.maxActive && range.min > range.max;
            range.isError = error;
            break;

          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            break;
        }
        break;

      case ftps.FIELD_TYPE_FLOAT:
        switch (this.state.appearance) {
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
            const {range} = this.validations;
            error = range && range.active && range.minActive && range.maxActive && range.min > range.max;
            range.isError = error;
            break;
        }
        break;

      case ftps.FIELD_TYPE_DATE:
        switch (this.state.appearance) {
          case ftps.FIELD_APPEARANCE__DATE__DATE:
          case ftps.FIELD_APPEARANCE__DATE__DATE_ONLY:
          case ftps.FIELD_APPEARANCE__DATE__TIME_ONLY:
            const {rangeDate} = this.validations;
            if (rangeDate && rangeDate.active && rangeDate.minActive && rangeDate.maxActive) {
              const dateMin = new Date(rangeDate.min);
              const dateMax = new Date(rangeDate.max);
              error = dateMin > dateMax;
            }
            rangeDate.isError = error;
            break;
        }
        break;

      case ftps.FIELD_TYPE_REFERENCE:
        const {models} = this.validations;
        if (models && models.active && !models.modelsList.length)
          error = true;
        models.isError = error;
        break;

      case ftps.FIELD_TYPE_MEDIA:
        const {fileSize} = this.validations;
        let error1 = false;
        if (fileSize && fileSize.active && fileSize.minActive && fileSize.maxActive) {
          const min = convertDataUnits(fileSize.min, fileSize.minUnit, BYTES);
          const max = convertDataUnits(fileSize.max, fileSize.maxUnit, BYTES);
          error1 = min > max;
        }
        fileSize.isError = error1;

        const {fileTypes} = this.validations;
        let error2 = false;
        if (fileTypes && fileTypes.active && !fileTypes.types.length)
          error2 = true;
        fileTypes.isError = error2;

        error = error1 || error2;
        break;
    }

    return error;
  }

  onUpdateValidations = validations => {
    this.validations = validations;
  };


  onValidValuesChange = validValues => {
    this.setState({validValues});
  };

  onClickTab = (e, tab) => {
    this.setState({tab});
    this.tabRef = e.target;
    this.calcCaretPos();
  };

  calcCaretPos = () => {
    if (!this.caretRef)
      return;

    if (this.tabRef) {
      const l = this.tabRef.offsetLeft;
      const w = this.tabRef.offsetWidth;
      this.caretRef.style = `opacity: 1; transform: translateX(${l}px); width: ${w}px;`;
    } else {
      this.caretRef.style = 'opacity: 0';
    }
  };

  render() {
    let headName = this.state.name.length ? this.state.name : '?';

    let tabSettStyle = 'tab';
    let tabAppStyle = 'tab';
    let tabValidStyle = 'tab';
    let content = null;
    switch (this.state.tab) {
      case TAB_SETTINGS:
        tabSettStyle += ' active';

        content = (
          <div>
            <div styleName="input-wrapper">
              <InputControl label="Title"
                            placeholder="Main Title"
                            DOMRef={inp => this.focusElm = inp}
                            onChange={this.onChangeName}
                            value={this.state.name} />
              {this.state.errorName &&
                <div styleName="error-same-name">This name is already in use.</div>
              }
            </div>

            <div styleName="input-wrapper">
              <InputControl label="Field ID"
                            icon="lock"
                            value={this.state.nameId}
                            readOnly={true} />
            </div>

            <div styleName="input-wrapper">
              <DropdownControl label="Type"
                               disabled={this.updating || this.state.isTitle}
                               list={this.typeList}
                               onSuggest={this.onChangeType}
                               current={this.state.type} />
            </div>

            <div styleName="input-wrapper switch-first">
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

      case TAB_APPEARANCE:
        tabAppStyle += ' active';

        let inner = null;

        switch (this.state.type) {
          case ftps.FIELD_TYPE_SHORT_TEXT:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__SHORT_TEXT__DROPDOWN:
                inner = (
                  <div>
                    <div styleName="label">Valid values:</div>
                    <DynamicListComponent values={this.state.validValues}
                                          ref={comp => this.validValuesList = comp}
                                          onChange={this.onValidValuesChange}
                                          disableEmpty />
                  </div>
                );
                break;
            }
            break;

          case ftps.FIELD_TYPE_INTEGER:
          case ftps.FIELD_TYPE_FLOAT:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__INTEGER__DROPDOWN:
              case ftps.FIELD_APPEARANCE__FLOAT__DROPDOWN:
                inner = (
                  <div>
                    <div styleName="label">Valid values:</div>
                    <DynamicListComponent values={this.state.validValues}
                                          ref={comp => this.validValuesList = comp}
                                          numeric
                                          numericInt={this.state.type == ftps.FIELD_TYPE_INTEGER}
                                          onChange={this.onValidValuesChange}
                                          disableEmpty />
                  </div>
                );
                break;
            }
            break;

          case ftps.FIELD_TYPE_BOOLEAN:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__BOOLEAN__RADIO:
                inner = (
                  <div styleName="input-wrapper boolean-text">
                    <div styleName="input">
                      <InputControl placeholder="Text for yes"
                                    onChange={this.onChangeBoolTextYes}
                                    value={this.state.boolTextYes}/>
                    </div>
                    <div styleName="input">
                      <InputControl placeholder="Text for no"
                                    onChange={this.onChangeBoolTextNo}
                                    value={this.state.boolTextNo}/>
                    </div>
                  </div>
                );
                break;
            }
            break;
        }

        const dropdownStyleName = classNames({
          'input-wrapper': true,
          'bottom-margin': !inner
        });

        content = (
          <div>
            <div styleName={dropdownStyleName}>
              <DropdownControl label="Appearance"
                               disabled={this.state.isTitle}
                               list={this.state.appList}
                               onSuggest={this.onChangeAppearance}
                               current={this.state.appearance} />
            </div>
            {inner}
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

          case ftps.FIELD_TYPE_DATE:
            switch (this.state.appearance) {
              case ftps.FIELD_APPEARANCE__DATE__DATE:
              case ftps.FIELD_APPEARANCE__DATE__DATE_ONLY:
              case ftps.FIELD_APPEARANCE__DATE__TIME_ONLY:
                validations = <ValidationDate appearance={this.state.appearance}
                                              validations={this.validations}
                                              update={this.onUpdateValidations} />;
                break;
            }
            break;

          case ftps.FIELD_TYPE_REFERENCE:
            validations = <ValidationReference validations={this.validations}
                                               models={this.props.models}
                                               update={this.onUpdateValidations} />;
            break;

          case ftps.FIELD_TYPE_MEDIA:
            validations = <ValidationMedia validations={this.validations}
                                           update={this.onUpdateValidations} />;
            break;
        }

        content = (
          <div>
            <div styleName="validation validation-first">
              <div styleName="switch">
                <CheckboxControl title="Required"
                                 checked={this.state.isRequired}
                                 onChange={this.onChangeIsRequired}
                                 disabled={this.state.isTitle} />
              </div>
            </div>
            {canBeUnique(this.state) &&
              <div styleName="validation">
                <div styleName="switch">
                  <CheckboxControl title="Unique value"
                                   checked={this.state.isUnique}
                                   onChange={this.onChangeIsUnique} />
                </div>
              </div>
            }
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
            </div>
            <div styleName="tabs">
              <div styleName={tabSettStyle}
                   ref={el => {if (!this.tabRef) this.tabRef = el;}}
                   onClick={e => this.onClickTab(e, TAB_SETTINGS)}>General</div>
              <div styleName={tabAppStyle}
                   onClick={e => this.onClickTab(e, TAB_APPEARANCE)}>Appearance</div>
              <div styleName={tabValidStyle}
                   onClick={e => this.onClickTab(e, TAB_VALIDATIONS)}>Validations</div>

              <div styleName="caret" ref={el => {this.caretRef = el}} />
            </div>
          </div>
          <div styleName="content">
            <form>
              {content}
              <div styleName="input-wrapper buttons-wrapper">
                <div styleName="buttons-inner">
                  <ButtonControl color="black"
                                 value="Cancel"
                                 onClick={this.close} />
                </div>
                <div styleName="buttons-inner">
                  <ButtonControl color="purple"
                                 value="Save Changes"
                                 onClick={this.onSave} />
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}
