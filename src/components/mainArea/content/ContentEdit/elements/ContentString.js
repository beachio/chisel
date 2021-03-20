import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import Editor from 'react-medium-editor';

import ContentBase from './ContentBase';
import InputControl from 'components/elements/InputControl/InputControl';
import DynamicListComponent from 'components/elements/DynamicListComponent/DynamicListComponent';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import MarkdownEditor from 'components/elements/MarkdownEditor/MarkdownEditor';
import {MODAL_TYPE_WYSIWYG, MODAL_TYPE_MARKDOWN} from 'ducks/nav';
import {addElectronContextMenu} from 'utils/common';
import {filterSpecialsAndCapital, checkURL} from 'utils/strings';

import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';

import ImageIconLink from 'assets/images/icons/link.svg';


@CSSModules(styles, {allowMultiple: true})
export default class ContentString extends ContentBase {
  constructor (props) {
    super(props);

    if (!this.state.value && this.state.field.isList)
      this.state.value = [];
  }

  static getDerivedStateFromProps(props, state) {
    if (state.field.appearance == ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG)
      return {
        item:  props.item,
        field: props.field,
        value: props.value
      };
    return ContentBase.getDerivedStateFromProps(props, state);
  }

  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;

    const {field} = this.state;
    if (field.isRequired && !this.state.value)
      return 'This field is required!';

    const checkRange = value => {
      const {range} = field.validations;
      if (range.minActive && value.length < range.min ||
          range.maxActive && value.length > range.max) {
        let error = range.errorMsg;
        if (!error)
          error = `The length of the string(s) is out of the permissible range: ${range.min} – ${range.max}!`;
        return error;
      }
    };
    const checkPattern = value => {
      const {pattern} = field.validations;
      const regexp = new RegExp('^' + pattern.pattern + '$', pattern.flags);
      if (!value.match(regexp)) {
        let error = pattern.errorMsg;
        if (!error)
          error = `The string(s) is not match the pattern: ${pattern.pattern}!`;
        return error;
      }
    };

    const checkMainValidations = value => {
      const {validations} = field;
      if (!validations)
        return null;

      let error;
      if (validations.range && validations.range.active) {
        error = checkRange(value);
        if (error)
          return error;
      }
      if (validations.pattern && validations.pattern.active) {
        error = checkPattern(value);
        if (error)
          return error;
      }
    };


    let value = this.state.value;

    switch (field.type) {
      case ftps.FIELD_TYPE_SHORT_TEXT:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
            if (!field.validations)
              break;

            if (field.isList) {
              for (let itemValue of value) {
                let error = checkMainValidations(itemValue);
                if (error)
                  return error;
              }
            } else {
              let error = checkMainValidations(value);
              if (error)
                return error;
            }

            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            if (!value)
              break;

            let slug = filterSpecialsAndCapital(value, "-");
            if (slug !== value)
              return "Slug must not contain special symbols and capital letters!";

            let error = checkMainValidations(value);
            if (error)
              return error;

            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
            if (!value)
              break;

            if (!checkURL(value))
              return "The URL is invalid!";
            break;
        }
        break;

      case ftps.FIELD_TYPE_LONG_TEXT:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            let error = checkMainValidations(value);
            if (error)
              return error;

            break;
        }
    }

    return null;
  }

  onChange = value => {
    this.setValue(value);
  };

  onChangeTextarea = event => {
    this.setValue(event.target.value);
  };

  onChangeList = values => {
    this.setValue(values);
  };

  onChangeDropdown = (v, i) => {
    if (i === undefined) {
      this.setValue(v);

    } else {
      let list = this.state.value ? this.state.value : [];
      if (v === undefined)
        list = list.slice(0, i).concat(list.slice(i + 1));
      else
        list[i] = v;
      this.setValue(list);
    }
  };

  onChangeWysiwyg = text => {
    this.setValue(text);
  };

  onChangeMarkdown = text => {
    this.setValue(text);
  };

  onShowWysiwygModal = () => {
    this.props.showModal(
      MODAL_TYPE_WYSIWYG,
      {
        text: this.state.value,
        callback: text => this.setValue(text, true)
      }
    );
  };

  onShowMarkdownModal = () => {
    this.props.showModal(
      MODAL_TYPE_MARKDOWN,
      {
        text: this.state.value,
        callback: text => this.setValue(text, true),
        readOnly: !this.props.isEditable
      }
    );
  };

  getTitle() {
    const {field} = this.state;

    switch (field.appearance) {
      case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
        return (
          <div styleName="field-title">
            {field.name}
            <div styleName="link" onClick={this.onShowWysiwygModal}>
              <InlineSVG styleName="link-icon" src={ImageIconLink}/>
            </div>
          </div>
        );

      case ftps.FIELD_APPEARANCE__LONG_TEXT__MARKDOWN:
        return (
          <div styleName="field-title">
            {field.name}
            <div styleName="link" onClick={this.onShowMarkdownModal}>
              <InlineSVG styleName="link-icon" src={ImageIconLink}/>
            </div>
          </div>
        );

      default:
        return (
          <div styleName="field-title">
            {field.name}
          </div>
        );
    }
  }

  getInput() {
    const {isEditable} = this.props;
    const {value, field} = this.state;

    switch (field.type) {

      case ftps.FIELD_TYPE_SHORT_TEXT:

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
            let inner;

            if (field.isList) {
              inner = <DynamicListComponent values={value}
                                            onChange={this.onChangeList}
                                            titled={!!field.name}
                                            readOnly={!isEditable} />;
            } else {
              inner = <InputControl type="big"
                                    value={value}
                                    titled={!!field.name}
                                    readOnly={!isEditable}
                                    onChange={this.onChange} />;
            }

            return (
              <div styleName="input-wrapper">
                {inner}
              </div>
            );

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            return (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              titled={!!field.name}
                              readOnly={!isEditable}
                              onChange={this.onChange} />
              </div>
            );

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
            return (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              titled={!!field.name}
                              onChange={this.onChange} />
              </div>
            );

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__DROPDOWN:
            const getElement = (v, i) => (
              <div styleName="dropdown-wrapper" key={i}>
                <div styleName="dropdown">
                  <DropdownControl disabled={!isEditable}
                                   list={field.validValues}
                                   titled={!!field.name}
                                   onSuggest={_v => this.onChangeDropdown(_v, i)}
                                   current={v}/>
                </div>
                {isEditable &&
                  <div styleName="clear"
                       style={{visibility: v === undefined ? 'hidden' : 'visible'}}
                       onClick={() => this.onChangeDropdown(undefined, i)}>
                    Reset
                  </div>
                }
              </div>
            );

            if (!field.isList)
              return getElement(value);

            if (!value)
              return getElement(undefined, 0);

            return (
              <div>
                {value.map(getElement)}
                {getElement(undefined, value.length)}
              </div>
            );
        }
        break;


      case ftps.FIELD_TYPE_LONG_TEXT:

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
            return (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              onChange={this.onChange} />
              </div>
            );

          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            return (
              <textarea styleName="textarea"
                        value={value}
                        ref={elm => addElectronContextMenu(elm, !isEditable)}
                        readOnly={!isEditable}
                        onChange={this.onChangeTextarea} />
            );

          case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
            return (
              <Editor styleName="wysiwig"
                      text={value}
                      onChange={this.onChangeWysiwyg}
                      options={{
                        placeholder: false,
                        disableEditing: !isEditable
                      }} />
            );

          case ftps.FIELD_APPEARANCE__LONG_TEXT__MARKDOWN:
            return (
              <MarkdownEditor value={value}
                              readOnly={!isEditable}
                              onChange={this.onChangeMarkdown} />
            );
        }
    }

    return null;
  }
}
