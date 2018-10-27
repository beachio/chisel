import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';

import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import InputControl from "components/elements/InputControl/InputControl";

import styles from '../FieldModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ValidationDate extends Component {
  state = {
    rangeDate: {
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
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        active: value
      }}, this.update);
  };
  
  
  onChangeMinDate = _date => {
    const date = _date[0];
    let oldDate = this.state.rangeDate.min;
    if (!oldDate)
      oldDate = new Date();
    date.setHours(oldDate.getHours());
    date.setMinutes(oldDate.getMinutes());
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        min: date
      }}, this.update);
  };
  
  onChangeMinTime = _time => {
    let time = _time[0];
    let date = this.state.rangeDate.min;
    if (!date)
      date = new Date();
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        min: date
      }}, this.update);
  };
  
  onChangeMaxDate = _date => {
    const date = _date[0];
    let oldDate = this.state.rangeDate.max;
    if (!oldDate)
      oldDate = new Date();
    date.setHours(oldDate.getHours());
    date.setMinutes(oldDate.getMinutes());
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        max: date
      }}, this.update);
  };
  
  onChangeMaxTime = _time => {
    let time = _time[0];
    let date = this.state.rangeDate.max;
    if (!date)
      date = new Date();
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        max: date
      }}, this.update);
  };
  
  
  onRangeMinActive = value => {
    let {maxActive} = this.state.rangeDate;
    if (!value)
      maxActive = true;
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        minActive: value,
        maxActive
      }}, this.update);
  };
  
  onRangeMaxActive = value => {
    let {minActive} = this.state.rangeDate;
    if (!value)
      minActive = true;
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        maxActive: value,
        minActive
      }}, this.update);
  };
  
  onRangeErrorMsg = event => {
    const {value} = event.target;
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        errorMsg: value
      }}, this.update);
  };
  
  update = () => {
    this.props.update(this.state);
  };
  
  render() {
    const styleMin = this.state.rangeDate.active && this.state.rangeDate.minActive ? '' : ' disabled';
    const styleMax = this.state.rangeDate.active && this.state.rangeDate.maxActive ? '' : ' disabled';
    
    return (
      <div>
        <div styleName="validation">
          <div styleName="switch">
            <CheckboxControl title="Accept only specified number range"
                             checked={this.state.rangeDate.active}
                             onChange={this.onRangeActive} />
          </div>
          <div styleName="data-time-wrapper">
            <div styleName="checkbox">
              <CheckboxControl title="Min"
                               checked={this.state.rangeDate.minActive}
                               onChange={this.onRangeMinActive}
                               disabled={!this.state.rangeDate.active} />
            </div>
            <div styleName={"date" + styleMin}>
              <Flatpickr value={this.state.rangeDate.min}
                         data-alt-input="true"
                         onChange={this.onChangeMinDate} />
            </div>
            <div styleName={"time" + styleMin}>
              <Flatpickr value={this.state.rangeDate.min}
                         data-no-calendar={true}
                         data-enable-time={true}
                         data-alt-format="h:i K"
                         data-alt-input="true"
                         onChange={this.onChangeMinTime} />
            </div>
          </div>
          <div styleName="data-time-wrapper">
            <div styleName="checkbox">
              <CheckboxControl title="Max"
                               checked={this.state.rangeDate.maxActive}
                               onChange={this.onRangeMaxActive}
                               disabled={!this.state.rangeDate.active} />
            </div>
            <div styleName={"date" + styleMax}>
              <Flatpickr value={this.state.rangeDate.max}
                         data-alt-input="true"
                         onChange={this.onChangeMaxDate} />
            </div>
            <div styleName={"time" + styleMax}>
              <Flatpickr value={this.state.rangeDate.max}
                         data-no-calendar={true}
                         data-enable-time={true}
                         data-alt-format="h:i K"
                         data-alt-input="true"
                         onChange={this.onChangeMaxTime} />
            </div>
          </div>
          <InputControl label="Custom error message"
                        onChange={this.onRangeErrorMsg}
                        value={this.state.rangeDate.errorMsg}
                        readOnly={!this.state.rangeDate.active} />
          {
            (this.state.rangeDate.min > this.state.rangeDate.max) &&
            <div styleName="error">
              Error: the min value should be smaller than max value! Please, fix it.
            </div>
          }
        </div>
      </div>
    );
  }
}
