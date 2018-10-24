import React, {Component} from 'react';

import InputControl from "components/elements/InputControl/InputControl";


export default class ContentBase extends Component {
  state = {value: '0'};
  
  constructor(props) {
    super(props);
    
    this.state.value = props.value ? props.value : '0';
  }
  
  componentWillUnmount() {
    const {onChange} = this.props;
    onChange(this.parseValue());
  }
  
  onChange = event => {
    let value = event.target.value;
    value = value.replace(/[^\d\.,]/g, '');
    this.setState({value});
  };
  
  onBlur = () => {
    const {onBlur, onChange} = this.props;
    const value = this.parseValue();
    this.setState({value});
    onChange(value);
    if (onBlur)
      onBlur();
  };
  
  parseValue() {
    const {isInt} = this.props;
    const parseFunc = isInt ? parseInt : parseFloat;
  
    let num = parseFunc(this.state.value);
    if (isNaN(num))
      return 0;
    return num;
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
                         ref={DOMRef} />;
  }
}
