import React from 'react';
import CSSModules from 'react-css-modules';
import ReactStars from 'react-stars';

import ContentBase from './ContentBase';
import InputControl from 'components/elements/InputControl/InputControl';

import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentNumber extends ContentBase {
  state = {
    error: null,
    value: 0
  };
  
  
  constructor(props) {
    super(props);
  
    let value = props.value;
    if (value)
      this.state.value = value;
  }
  
  getError () {
    let value = this.state.value;
    
    switch (this.field.type) {
      case ftps.FIELD_TYPE_FLOAT:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
            break;
        }
        break;
  
      case ftps.FIELD_TYPE_INTEGER:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
            if (!value)
              value = 0;
            if (Math.floor(value) != parseFloat(value))
              return "You must type an integer value!";
            break;
      
          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            break;
        }
        break;
    }
    
    return null;
  }
  
  onChange_STRING = (event, i) => {
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
        this.updateItemTitle(value);
    }
  };
  
  onKeyDown_INTEGER = (event, i, inputs) => {
    event.stopPropagation();
  
    if (!this.field.isList)
      return;
    
    let code = event.keyCode;
    
    //Enter or down pressed
    if (code == 13 || code == 40) {
      if (inputs[i + 1]) {
        let items = this.state.value;
        let num = parseInt(items[i]);
        if (!isNaN(num))
          inputs[i + 1].focus();
        else
          this.onBlur_INTEGER(i);
      }
      
      //up pressed
    } else if (code == 38) {
      if (i)
        inputs[--i].focus();
    }
  };
  
  onKeyDown_FLOAT = (event, i, inputs) => {
    event.stopPropagation();
  
    if (!this.field.isList)
      return;
    
    let code = event.keyCode;
    
    //Enter or down pressed
    if (code == 13 || code == 40) {
      if (inputs[i + 1]) {
        let items = this.state.value;
        let num = parseFloat(items[i]);
        if (!isNaN(num))
          inputs[i + 1].focus();
        else
          this.onBlur_FLOAT(i);
      }
      
      //up pressed
    } else if (code == 38) {
      if (i)
        inputs[--i].focus();
    }
  };
  
  onBlur_INTEGER = i => {
    if (this.field.isList) {
      let items = this.state.value;
      if (!items)
        return;
      
      let num = parseInt(items[i]);
      if (!isNaN(num))
        items[i] = num;
      else
        items.splice(i, 1);
      
      this.setValue(items);
      
    } else {
      this.setValue(parseInt(this.state.value));
    }
  };
  
  onBlur_FLOAT = i => {
    if (this.field.isList) {
      let items = this.state.value;
      if (!items)
        return;
      
      let num = parseFloat(items[i]);
      if (!isNaN(num))
        items[i] = num;
      else
        items.splice(i, 1);
      
      this.setValue(items);
      
    } else {
      let str = this.state.value;
      this.setValue(parseFloat(str));
    }
  };
  
  onChange_INTEGER__RATING = value => {
    value *= 2;
    this.setValue(value);
  };
  
  getInput() {
    let value = this.state.value;
    
    switch (this.field.type) {
      case ftps.FIELD_TYPE_FLOAT:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
            let innerFloat;
        
            if (this.field.isList) {
              if (!value)
                value = [];
          
              innerFloat = [];
              let inputs = [];
              for (let i = 0; i < value.length + 1; i++) {
                innerFloat.push(<InputControl type="big"
                                              key={i}
                                              value={value[i]}
                                              readOnly={!this.isEditable}
                                              onChange={e => this.onChange_STRING(e, i)}
                                              DOMRef={inp => inputs[i] = inp}
                                              onBlur={e => this.onBlur_FLOAT(i)}
                                              onKeyDown={e => this.onKeyDown_FLOAT(e, i, inputs)} />);
              }
          
            } else {
              innerFloat = <InputControl type="big"
                                         value={value}
                                         readOnly={!isEditable}
                                         onChange={this.onChange_STRING}
                                         onBlur={this.onBlur_FLOAT} />;
            }
        
            return (
              <div styleName="input-wrapper">
                {innerFloat}
              </div>
            );
        }
  
      case ftps.FIELD_TYPE_INTEGER:
        switch (this.field.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
            let innerInt;
        
            if (this.field.isList) {
              if (!value)
                value = [];
          
              innerInt = [];
              let inputs = [];
              for (let i = 0; i < value.length + 1; i++) {
                innerInt.push(<InputControl type="big"
                                            key={i}
                                            value={value[i]}
                                            readOnly={!this.isEditable}
                                            onChange={e => this.onChange_STRING(e, i)}
                                            DOMRef={inp => inputs[i] = inp}
                                            onBlur={e => this.onBlur_INTEGER(i)}
                                            onKeyDown={e => this.onKeyDown_INTEGER(e, i, inputs)} />);
              }
          
            } else {
              innerInt = <InputControl type="big"
                                       value={value}
                                       readOnly={!this.isEditable}
                                       onChange={this.onChange_STRING}
                                       onBlur={this.onBlur_INTEGER}
                                       onKeyDown={this.onKeyDown} />;
            }
        
            return (
              <div styleName="input-wrapper">
                {innerInt}
              </div>
            );
      
          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            value *= .5;
            return (
              <div styleName="input-wrapper">
                <ReactStars styleName="react-stars"
                            value={value}
                            onChange={this.onChange_INTEGER__RATING}
                            size={32}
                            color1={'#F5F5F5'}
                            color2={'#5CA6DC'} />
              </div>
            );
        }
    }
  }
  
}
