import React, {Component} from 'react';

import InputControl from "components/elements/InputControl/InputControl";


export default class InputNumberControl extends Component {
  state = {value: '0'};
  valueLast;
  parseFunc;
  
  
  constructor(props) {
    super(props);
  
    this.parseFunc = props.isInt ? parseInt : parseFloat;
    
    this.state.value = props.value ? props.value : '0';
    this.valueLast = this.parseFunc(props.value);
  }
  
  componentWillReceiveProps(nextProps) {
    let {value} = nextProps;
    value = value ? value : '0';
    this.setState({value});
    this.valueLast = this.parseFunc(value);
  }
  
  componentWillUnmount() {
    this.sendChange(this.parseValue());
  }
  
  onChange = event => {
    let {value} = event.target;
    value = value.replace(/[^\d\.,]/g, '');
    value = value.replace(/,/g, '.');
    this.setState({value});
  };
  
  onBlur = () => {
    const value = this.parseValue();
    this.setState({value});
    this.sendChange(value);
  
    const {onBlur} = this.props;
    if (onBlur)
      onBlur();
  };
  
  parseValue() {
    let num = this.parseFunc(this.state.value);
    if (isNaN(num))
      return 0;
    return num;
  }
  
  sendChange(value) {
    if (this.valueLast === value)
      return;
    this.valueLast = value;
  
    const {onChange} = this.props;
    onChange(value);
  }
  
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
