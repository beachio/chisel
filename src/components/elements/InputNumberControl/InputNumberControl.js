import React, {Component} from 'react';

import InputControl from "components/elements/InputControl/InputControl";


export default class InputNumberControl extends Component {
  state = {
    value: this.props.value,
    valueParsed: InputNumberControl.parseValue(this.props.value, this.props)
  };


  static getDerivedStateFromProps(props, state) {
    const valueParsed = InputNumberControl.parseValue(props.value, props);
    if (valueParsed === state.valueParsed)
      return null;
    return {value: valueParsed, valueParsed};
  }

  static parseValue(value, props) {
    const {min, max, isInt} = props;

    const parseFunc = isInt ? parseInt : parseFloat;
    let num = parseFunc(value);
    if (isNaN(num))
      return undefined;

    if (min !== undefined && min !== null && num < min)
      num = min;
    if (max !== undefined && max !== null && num > max)
      num = max;

    return num;
  }

  onChange = value => {
    value = value.replace(/[^\d.,]/g, '');
    value = value.replace(/,/g, '.');
    this.setState({value});

    const valueParsed = InputNumberControl.parseValue(value, this.props);
    if (valueParsed === this.state.valueParsed)
      return;
    this.setState({valueParsed});

    this.props.onChange(valueParsed);
  };

  onBlur = () => {
    this.setState({value: this.state.valueParsed});
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
