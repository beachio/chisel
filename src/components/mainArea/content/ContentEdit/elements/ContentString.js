import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import Editor from 'react-medium-editor';

import ContentBase from './ContentBase';
import InputControl from 'components/elements/InputControl/InputControl';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import MarkdownEditor from 'components/elements/MarkdownEditor/MarkdownEditor';
import {MODAL_TYPE_WYSIWYG, MODAL_TYPE_MARKDOWN} from 'ducks/nav';
import {filterSpecialsAndCapital, checkURL} from 'utils/common';

import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentString extends ContentBase {
  constructor (props) {
    super(props);
    
    if (!this.state.value && this.field.isList)
      this.state.value = [];
  }
  
  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;
  
    if (this.field.isRequired && !this.state.value)
      return 'This field is required!';
  
    const checkRange = value => {
      const range = this.field.validations.range;
      if (range.minActive && value.length < range.min ||
        range.maxActive && value.length > range.max) {
        let error = range.errorMsg;
        if (!error)
          error = "The length is out of permissible range!";
        return error;
      }
    };
    const checkPattern = value => {
      const pattern = this.field.validations.pattern;
      const regexp = new RegExp('^' + pattern.pattern + '$', pattern.flags);
      if (!value.match(regexp)) {
        let error = pattern.errorMsg;
        if (!error)
          error = "The string is not match the pattern!";
        return error;
      }
    };
  
    const checkMainValidations = value => {
      if (!this.field.validations)
        return null;
      
      let error;
      if (this.field.validations.range && this.field.validations.range.active) {
        error = checkRange(value);
        if (error)
          return error;
      }
      if (this.field.validations.pattern && this.field.validations.pattern.active) {
        error = checkPattern(value);
        if (error)
          return error;
      }
    };
  
    
    let value = this.state.value;
    
    switch (this.field.type) {
      case ftps.FIELD_TYPE_SHORT_TEXT:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
            if (!this.field.validations)
              break;
  
            if (this.field.isList) {
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
              return "You must type a valid URL!";
            break;
        }
        break;
        
      case ftps.FIELD_TYPE_LONG_TEXT:
        switch (this.field.appearance) {
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
  
  onChange = (event, i) => {
    let value = event.target.value;
    
    if (this.field.isList) {
      const items = this.state.value.slice();
      items[i] = value;
      this.setValue(items);
      
    } else {
      this.setValue(value);
      if (this.field.isTitle)
        this.props.updateItemTitle(value);
    }
  };
  
  onChangeDropdown = value => {
    this.setValue(value);
  }
  
  onChangeWysiwyg = text => {
    this.setValue(text);
  };

  onChangeMarkdown = text => {
    this.setValue(text);
  };
  
  onKeyDown = (event, i, inputs) => {
    event.stopPropagation();
  
    if (!this.field.isList)
      return;
    
    let code = event.keyCode;
    
    //Enter or down pressed
    if (code == 13 || code == 40) {
      if (inputs[i + 1])
        inputs[i + 1].focus();
      
    //up pressed
    } else if (code == 38) {
      if (i)
        inputs[--i].focus();
    }
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
        callback: text => this.setValue(text, true)
      }
    );
  };
  
  getTitle() {
    switch (this.field.appearance) {
      case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
        return (
          <div styleName="field-title">
            {this.field.name}
            <div styleName="link" onClick={this.onShowWysiwygModal}>
              <InlineSVG styleName="link-icon" src={require('assets/images/link.svg')}/>
            </div>
          </div>
        );
        
      case ftps.FIELD_APPEARANCE__LONG_TEXT__MARKDOWN:
        return (
          <div styleName="field-title">
            {this.field.name}
            <div styleName="link" onClick={this.onShowMarkdownModal}>
              <InlineSVG styleName="link-icon" src={require('assets/images/link.svg')}/>
            </div>
          </div>
        );
        
      default:
        return (
          <div styleName="field-title">
            {this.field.name}
          </div>
        );
    }
  }
  
  onPlus = (i = 0) => {
    let items = this.state.value ? this.state.value : [];
    let itemsLeft = items.slice(0, i + 1);
    let itemsRight = items.slice(i + 1);
    items = itemsLeft.concat('', itemsRight);
    this.setValue(items);
  };
  
  onMinus = i => {
    let items = this.state.value.slice();
    items.splice(i, 1);
    this.setValue(items);
  };
  
  getInput() {
    let value = this.state.value;
    
    switch (this.field.type) {

      case ftps.FIELD_TYPE_SHORT_TEXT:

        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
            let inner;
        
            if (this.field.isList) {
              if (value && value.length) {
                inner = [];
                let inputs = [];
                for (let i = 0; i < value.length; i++) {
                  inner.push(
                    <div styleName="list-item"
                         key={i}>
                      <InputControl type="big"
                                    value={value[i]}
                                    readOnly={!this.state.isEditable}
                                    DOMRef={inp => inputs[i] = inp}
                                    onChange={e => this.onChange(e, i)}
                                    onKeyDown={e => this.onKeyDown(e, i, inputs)}/>
                      <div styleName="list-item-plus"
                           onClick={() => this.onPlus(i)}>
                        +
                      </div>
                      <div styleName="list-item-minus"
                           onClick={() => this.onMinus(i)}>
                        –
                      </div>
                    </div>
                  );
                }
              } else {
                inner = (
                  <div styleName="list-plus"
                       onClick={() => this.onPlus()}>
                    List is empty. Add element?
                  </div>
                );
              }
          
            } else {
              inner = <InputControl type="big"
                                    value={value}
                                    readOnly={!this.state.isEditable}
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
                              readOnly={!this.state.isEditable}
                              onChange={this.onChange} />
              </div>
            );
      
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
            return (
              <div styleName="input-wrapper url">
                <InputControl type="big"
                              value={value}
                              readOnly={!this.state.isEditable}
                              onChange={this.onChange} />
              </div>
            );
  
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__DROPDOWN:
            return (
              <div styleName="input-wrapper">
                <DropdownControl disabled={!this.state.isEditable}
                                 suggestionsList={this.field.validValues}
                                 suggest={this.onChangeDropdown}
                                 current={value} />
              </div>
            );
        }
        break;
  

      case ftps.FIELD_TYPE_LONG_TEXT:

        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
            return (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              readOnly={!this.state.isEditable}
                              onChange={this.onChange} />
              </div>
            );
      
          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            return (
              <textarea styleName="textarea"
                        value={value}
                        readOnly={!this.state.isEditable}
                        onChange={this.onChange} />
            );
      
          case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
            return (
              <Editor styleName="wysiwig"
                      text={value}
                      onChange={this.onChangeWysiwyg}
                      options={{
                        placeholder: false,
                        disableEditing: !this.state.isEditable
                      }} />
            );

          case ftps.FIELD_APPEARANCE__LONG_TEXT__MARKDOWN:
            return (
              <MarkdownEditor styleName="markdown"
                              value={value}
                              onChange={this.onChangeMarkdown} />
            );
        }
    }

    return null;
  }
}
