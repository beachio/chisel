import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import InputControl from "components/elements/InputControl/InputControl";
import InputNumberControl from 'components/elements/InputNumberControl/InputNumberControl';

import styles from '../FieldModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ValidationInteger extends Component {
  state = {
    range: {
      active: false,
      min: 0,
      max: 0,
      minActive: true,
      maxActive: true,
      errorMsg: ''
    }
  };
  
  constructor(props) {
    super(props);
  
    Object.assign(this.state, props.validations);
  }
  
  onRangeActive = value => {
    this.setState({range: {
        ...this.state.range,
        active: value
    }}, this.update);
  };
  
  onRangeMin = value => {
    this.setState({range: {
        ...this.state.range,
        min: value
    }}, this.update);
  };
  
  onRangeMax = value => {
    this.setState({range: {
        ...this.state.range,
        max: value
    }}, this.update);
  };
  
  onRangeMinActive = value => {
    let {maxActive} = this.state.range;
    if (!value)
      maxActive = true;
    this.setState({range: {
        ...this.state.range,
        minActive: value,
        maxActive
    }}, this.update);
  };
  
  onRangeMaxActive = value => {
    let {minActive} = this.state.range;
    if (!value)
      minActive = true;
    this.setState({range: {
        ...this.state.range,
        maxActive: value,
        minActive
    }}, this.update);
  };
  
  onRangeErrorMsg = event => {
    const {value} = event.target;
    this.setState({range: {
        ...this.state.range,
        errorMsg: value
    }}, this.update);
  };
  
  update = () => {
    this.props.update(this.state);
  };
  
  render() {
    return (
      <div>
        <div styleName="validation">
          <div styleName="switch">
            <CheckboxControl title="Accept only specified number range"
                             checked={this.state.range.active}
                             onChange={this.onRangeActive} />
          </div>
          <div styleName="range">
            <CheckboxControl title="Min"
                             checked={this.state.range.minActive}
                             onChange={this.onRangeMinActive}
                             disabled={!this.state.range.active} />
            <div styleName="range-field">
              <InputNumberControl onChange={this.onRangeMin}
                                  value={this.state.range.min}
                                  readOnly={!this.state.range.active || !this.state.range.minActive} />
            </div>
            <CheckboxControl title="Max"
                             checked={this.state.range.maxActive}
                             onChange={this.onRangeMaxActive}
                             disabled={!this.state.range.active} />
            <div styleName="range-field">
              <InputNumberControl onChange={this.onRangeMax}
                                  value={this.state.range.max}
                                  readOnly={!this.state.range.active || !this.state.range.maxActive} />
            </div>
          </div>
          <InputControl label="Custom error message"
                        onChange={this.onRangeErrorMsg}
                        value={this.state.range.errorMsg}
                        readOnly={!this.state.range.active} />
          {
            (this.state.range.min > this.state.range.max) &&
              <div styleName="error">
                Error: the min value should be smaller than max value! Please, fix it.
              </div>
          }
        </div>
      </div>
    );
  }
}
