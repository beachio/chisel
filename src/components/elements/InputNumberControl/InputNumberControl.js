import React, {Component} from 'react';

import InputControl from "components/elements/InputControl/InputControl";


export default class InputNumberControl extends Component {
  state = {value: '0'};
  valueParsed = 0;
  parseFunc;
  min;
  max;
  
  
  constructor(props) {
    super(props);
  
    this.parseFunc = props.isInt ? parseInt : parseFloat;
    this.min = props.min;
    this.max = props.max;
    
    this.state.value = props.value;
    this.valueParsed = this.parseValue(props.value);
  }
  
  componentWillReceiveProps(nextProps) {
    const {value, min, max} = nextProps;
  
    this.min = min;
    this.max = max;
    
    const valueParsed = this.parseValue(value);
    if (valueParsed === this.valueParsed)
      return;
    this.valueParsed = valueParsed;
    this.setState({value: valueParsed});
  }
  
  parseValue(value) {
    let num = this.parseFunc(value);
    if (isNaN(num))
      return undefined;
  
    if (this.min !== undefined && this.min !== null && num < this.min)
      num = this.min;
    if (this.max !== undefined && this.max !== null && num > this.max)
      num = this.max;
    
    return num;
  }
  
  onChange = event => {
    let {value} = event.target;
    value = value.replace(/[^\d\.,]/g, '');
    value = value.replace(/,/g, '.');
    this.setState({value});
    
    const valueParsed = this.parseValue(value);
    if (valueParsed === this.valueParsed)
      return;
    this.valueParsed = valueParsed;
  
    this.props.onChange(valueParsed);
  };
  
  onBlur = () => {
    this.setState({value: this.valueParsed});
  };
  
  render() {
    let {type, label, placeholder, readOnly, autoFocus, onKeyDown, DOMRef, icon} = this.props;
    
    return <InputControl value={this.state.value}
                         onChange={this.onChange}
                         onBlur={this.onBlur}
                         type={type}
                         label={label}
                         icon={icon}
                         onKeyDown={onKeyDown}
                         placeholder={placeholder}
                         autoFocus={autoFocus}
                         readOnly={readOnly}
                         DOMRef={DOMRef} />;
  }
}
