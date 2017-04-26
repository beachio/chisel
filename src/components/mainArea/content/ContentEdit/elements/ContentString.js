import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import Editor from 'react-medium-editor';

import ContentBase from './ContentBase';
import InputControl from 'components/elements/InputControl/InputControl';
import {MODAL_TYPE_WYSIWYG} from 'ducks/nav';
import {filterSpecials, checkURL} from 'utils/common';

import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentString extends ContentBase {
  constructor (props) {
    super(props);
  
    let value = props.value;
    if (value)
      this.state.value = value;
    else if (this.field.isList)
      this.state.value = [];
    else if (this.field.appearance == ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG)
      this.state.value = `<p></p>`;
    else
      this.state.value = ``;
  }
  
  getError () {
    let value = this.state.value;
    
    switch (this.field.type) {
      case ftps.FIELD_TYPE_SHORT_TEXT:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
            if (!value && this.field.isTitle)
              return "Title must be present!";
            break;
          
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            if (!value)
              break;
            
            let slug = filterSpecials(value);
            if (slug !== value)
              return "Slug must not contain special symbols!";
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
            break;
          
          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            break;
          
          case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
            break;
        }
        break;
    }
    
    return null;
  }
  
  onChange = (event, i) => {
    let value = event.target.value;
    
    if (this.field.isList) {
      let items = this.state.value;
      if (!items)
        items = [];
      
      if (value)
        items[i] = value;
      else
        items.splice(i, 1);
      
      this.setValue(items);
      
    } else {
      this.setValue(value);
      if (this.field.isTitle)
        this.props.updateItemTitle(value);
    }
  };
  
  onChangeWysiwyg = text => {
    this.setValue(text);
  };
  
  onKeyDown = (event, i, inputs) => {
    event.stopPropagation();
  
    if (!this.field.isList)
      return;
    
    let code = event.keyCode;
    
    //Enter or down pressed
    if (code == 13 || code == 40) {
      if (inputs[i + 1]) {
        let items = this.state.value;
        if (items[i])
          inputs[i + 1].focus();
      }
      
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
  
  getTitle() {
    if (this.field.appearance == ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG)
      return (
        <div styleName="field-title">
          {this.field.name}
          <div styleName="link" onClick={this.onShowWysiwygModal}>
            <InlineSVG styleName="link-icon" src={require('assets/images/link.svg')} />
          </div>
        </div>
      );
  
    return (
      <div styleName="field-title">
        {this.field.name}
      </div>
    );
  }
  
  getInput() {
    let value = this.state.value;
    
    switch (this.field.type) {
      case ftps.FIELD_TYPE_SHORT_TEXT:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
            let innerStr;
        
            if (this.field.isList) {
              innerStr = [];
              let inputs = [];
              for (let i = 0; i < value.length + 1; i++) {
                innerStr.push(<InputControl type="big"
                                            key={i}
                                            value={value[i]}
                                            readOnly={!this.isEditable}
                                            DOMRef={inp => inputs[i] = inp}
                                            onChange={e => this.onChange(e, i)}
                                            onKeyDown={e => this.onKeyDown(e, i, inputs)} />);
              }
          
            } else {
              innerStr = <InputControl type="big"
                                       value={value}
                                       readOnly={!this.isEditable}
                                       onChange={this.onChange} />;
            }
        
            return (
              <div styleName="input-wrapper">
                {innerStr}
              </div>
            );
      
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            return (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              readOnly={!this.isEditable}
                              onChange={this.onChange} />
              </div>
            );
      
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
            return (
              <div styleName="input-wrapper url">
                <InputControl type="big"
                              value={value}
                              readOnly={!this.isEditable}
                              onChange={this.onChange} />
              </div>
            );
        }
  
      case ftps.FIELD_TYPE_LONG_TEXT:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
            return (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              readOnly={!this.isEditable}
                              onChange={this.onChange} />
              </div>
            );
      
          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            return (
              <textarea styleName="textarea"
                        value={value}
                        readOnly={!this.isEditable}
                        onChange={this.onChange} />
            );
      
          case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
            return (
              <Editor styleName="wysiwig"
                      text={value}
                      onChange={this.onChangeWysiwyg}
                      options={{placeholder: false}} />
            );
        }
    }
  }
}
