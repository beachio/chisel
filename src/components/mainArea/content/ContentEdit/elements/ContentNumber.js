import React from 'react';
import CSSModules from 'react-css-modules';
import ReactStars from 'react-stars';

import ContentBase from './ContentBase';
import InputNumberControl from 'components/elements/InputNumberControl/InputNumberControl';
import DynamicListComponent from "components/elements/DynamicListComponent/DynamicListComponent";

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
  
  onChange = value => {
    this.setValue(value);
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
              inner = <DynamicListComponent values={value}
                                            onChange={this.onChange}
                                            readOnly={!this.state.isEditable}
                                            numeric
                                            numericInt={this.field.type == ftps.FIELD_TYPE_INTEGER} />;
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
