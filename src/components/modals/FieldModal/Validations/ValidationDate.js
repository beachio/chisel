import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';

import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import InputControl from "components/elements/InputControl/InputControl";
import {FIELD_APPEARANCE__DATE__DATE, FIELD_APPEARANCE__DATE__DATE_ONLY, FIELD_APPEARANCE__DATE__TIME_ONLY} from "models/ModelData";

import styles from '../FieldModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ValidationDate extends Component {
  state = {
    rangeDate: {
      active: false,
      min: new Date().toISOString(),
      max: new Date().toISOString(),
      minActive: true,
      maxActive: true,
      errorMsg: ''
    }
  };
  showDate;
  showTime;
  
  
  constructor(props) {
    super(props);
    
    this.showDate = props.appearance == FIELD_APPEARANCE__DATE__DATE || props.appearance == FIELD_APPEARANCE__DATE__DATE_ONLY;
    this.showTime = props.appearance == FIELD_APPEARANCE__DATE__DATE || props.appearance == FIELD_APPEARANCE__DATE__TIME_ONLY;
    
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
  
    const oldDate = this.state.rangeDate.min ? new Date(this.state.rangeDate.min) : new Date();
    
    if (this.showTime)
      date.setHours(oldDate.getHours(), oldDate.getMinutes());
    else
      date.setHours(0, 0, 0, 0);
    
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        min: date.toISOString()
      }}, this.update);
  };
  
  onChangeMinTime = _time => {
    const time = _time[0];
    const date = this.state.rangeDate.min ? new Date(this.state.rangeDate.min) : new Date(0);
    date.setHours(time.getHours(), time.getMinutes());
    
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        min: date.toISOString()
      }}, this.update);
  };
  
  onChangeMaxDate = _date => {
    const date = _date[0];
  
    const oldDate = this.state.rangeDate.max ? new Date(this.state.rangeDate.max) : new Date();
    
    if (this.showTime)
      date.setHours(oldDate.getHours(), oldDate.getMinutes());
    else
      date.setHours(23, 59, 59, 999);
    
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        max: date.toISOString()
      }}, this.update);
  };
  
  onChangeMaxTime = _time => {
    const time = _time[0];
    const date = this.state.rangeDate.max ? new Date(this.state.rangeDate.max) : new Date(0);
    date.setHours(time.getHours(), time.getMinutes());
    
    this.setState({rangeDate: {
        ...this.state.rangeDate,
        max: date.toISOString()
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
  
    const dateMin = new Date(this.state.rangeDate.min);
    const dateMax = new Date(this.state.rangeDate.max);
    
    return (
      <div>
        <div styleName="validation">
          <div styleName="switch">
            <CheckboxControl title="Accept only specified number range"
                             checked={this.state.rangeDate.active}
                             onChange={this.onRangeActive} />
          </div>
          {this.state.rangeDate.active &&
            <div>
              <div styleName="data-time-wrapper">
                <div styleName="checkbox">
                  <CheckboxControl title="Min"
                                   checked={this.state.rangeDate.minActive}
                                   onChange={this.onRangeMinActive}
                                   disabled={!this.state.rangeDate.active}/>
                </div>
                {this.showDate &&
                  <div styleName={"date" + styleMin}>
                    <Flatpickr value={dateMin}
                               data-alt-input="true"
                               onChange={this.onChangeMinDate}/>
                  </div>
                }
                {this.showTime &&
                  <div styleName={"time" + styleMin}>
                    <Flatpickr value={dateMin}
                               data-no-calendar={true}
                               data-enable-time={true}
                               data-alt-format="h:i K"
                               data-alt-input="true"
                               onChange={this.onChangeMinTime}/>
                  </div>
                }
              </div>
              <div styleName="data-time-wrapper">
                <div styleName="checkbox">
                  <CheckboxControl title="Max"
                                   checked={this.state.rangeDate.maxActive}
                                   onChange={this.onRangeMaxActive}
                                   disabled={!this.state.rangeDate.active}/>
                </div>
                {this.showDate &&
                  <div styleName={"date" + styleMax}>
                    <Flatpickr value={dateMax}
                               data-alt-input="true"
                               onChange={this.onChangeMaxDate}/>
                  </div>
                }
                {this.showTime &&
                  <div styleName={"time" + styleMax}>
                    <Flatpickr value={dateMax}
                               data-no-calendar={true}
                               data-enable-time={true}
                               data-alt-format="h:i K"
                               data-alt-input="true"
                               onChange={this.onChangeMaxTime}/>
                  </div>
                }
              </div>
              <InputControl label="Custom error message"
                            onChange={this.onRangeErrorMsg}
                            value={this.state.rangeDate.errorMsg}
                            readOnly={!this.state.rangeDate.active}/>
              {(dateMin > dateMax) &&
                <div styleName="error">
                  Error: the min value should be smaller than max value! Please, fix it.
                </div>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}
