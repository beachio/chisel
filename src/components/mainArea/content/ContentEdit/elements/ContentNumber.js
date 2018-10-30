import React from 'react';
import CSSModules from 'react-css-modules';
import ReactStars from 'react-stars';

import ContentBase from './ContentBase';
import InputNumberControl from 'components/elements/InputNumberControl/InputNumberControl';

import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentNumber extends ContentBase {
  constructor (props) {
    super(props);
    
    if (!this.state.value && this.field.isList)
      this.state.value = [];
  }
  
  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;
    
    let value = this.state.value;
    
    const checkRangeValidation = () => {
      if (!this.field.validations)
        return null;
      if (!this.field.validations.range || !this.field.validations.range.active)
        return null;
      
      const range = this.field.validations.range;
      
      const checkRange = value => {
        if (range.minActive && value < range.min ||
            range.maxActive && value > range.max) {
          let error = range.errorMsg;
          if (!error)
            error = "The value is out of permissible range!";
          return error;
        }
      };
      
      if (this.field.isList) {
        for (let itemValue of value) {
          let error = checkRange(itemValue);
          if (error)
            return error;
        }
      } else {
        if (!value)
          value = 0;
        return checkRange(value);
      }
    };
    
    switch (this.field.type) {
      case ftps.FIELD_TYPE_FLOAT:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
            let error = checkRangeValidation();
            if (error)
              return error;
            break;
        }
        break;
  
      case ftps.FIELD_TYPE_INTEGER:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
            let error = checkRangeValidation();
            if (error)
              return error;
            
            break;
      
          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            break;
        }
        break;
    }
    
    return null;
  }
  
  onChange = (value, i) => {
    if (this.field.isList) {
      const items = this.state.value.slice();
      items[i] = value;
      this.setValue(items);
      
    } else {
      this.setValue(value);
    }
  };
  
  onKeyDown = (event, i, inputs) => {
    event.stopPropagation();
  
    if (!this.field.isList)
      return;
    
    const code = event.keyCode;
    
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
  
  onPlus = (i = 0) => {
    let items = this.state.value ? this.state.value : [];
    let itemsLeft = items.slice(0, i + 1);
    let itemsRight = items.slice(i + 1);
    items = itemsLeft.concat(0, itemsRight);
    this.setValue(items);
  };
  
  onMinus = i => {
    let items = this.state.value.slice();
    items.splice(i, 1);
    this.setValue(items);
  };
  
  onChangeRating = value => {
    value *= 2;
    this.setValue(value);
  };
  
  getInput() {
    let value = this.state.value;
    
    switch (this.field.type) {
      case ftps.FIELD_TYPE_FLOAT:
      case ftps.FIELD_TYPE_INTEGER:
        
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
            
            let inner;
        
            if (this.field.isList) {
              if (value && value.length) {
                inner = [];
                let inputs = [];
                for (let i = 0; i < value.length; i++) {
                  inner.push(
                    <div styleName="list-item"
                         key={i}>
                      <InputNumberControl styleName="list-item-input"
                                          type="big"
                                          isInt={this.field.type == ftps.FIELD_TYPE_INTEGER}
                                          value={value[i]}
                                          readOnly={!this.state.isEditable}
                                          onChange={v => this.onChange(v, i)}
                                          DOMRef={inp => inputs[i] = inp}
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
              inner = <InputNumberControl type="big"
                                          isInt={this.field.type == ftps.FIELD_TYPE_INTEGER}
                                          value={value}
                                          readOnly={!this.state.isEditable}
                                          onChange={this.onChange} />;
            }
        
            return (
              <div styleName="input-wrapper">
                {inner}
              </div>
            );
      
          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            if (value)
              value *= .5;
            return (
              <div styleName="rating">
                <ReactStars value={value}
                            onChange={this.onChangeRating}
                            size={32}
                            edit={this.state.isEditable}
                            color1={'#F5F5F5'}
                            color2={'#5CA6DC'} />
                <div styleName="clear"
                     onClick={() => this.setValue(undefined)}>
                  Reset
                </div>
              </div>
            );
        }
    }
  }
  
}
