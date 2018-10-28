import React, {Component} from 'react';

import InputControl from "components/elements/InputControl/InputControl";


export default class InputNumberControl extends Component {
  state = {value: '0'};
  valueParsed = 0;
  parseFunc;
  
  
  constructor(props) {
    super(props);
  
    this.parseFunc = props.isInt ? parseInt : parseFloat;
    
    this.state.value = props.value;
    this.valueParsed = this.parseValue(props.value);
  }
  
  componentWillReceiveProps(nextProps) {
    const {value} = nextProps;
    
    const valueParsed = this.parseValue(value);
    if (valueParsed === this.valueParsed)
      return;
    this.valueParsed = valueParsed;
    
    this.setState({value});
  }
  
  parseValue(value) {
    const num = this.parseFunc(value);
    if (isNaN(num))
      return undefined;
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
