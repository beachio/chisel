import React from 'react';
import CSSModules from 'react-css-modules';

import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';

import ContentBase from './ContentBase';

import {FIELD_APPEARANCE__DATE__DATE, FIELD_APPEARANCE__DATE__DATE_ONLY, FIELD_APPEARANCE__DATE__TIME_ONLY} from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentDate extends ContentBase {
  validations = null;
  minDate;
  maxDate;
  
  constructor(props) {
    super(props);
    
    if (this.field.validations && this.field.validations.rangeDate && this.field.validations.rangeDate.active) {
      this.validations = this.field.validations.rangeDate;
  
      if (this.validations.minActive) {
        this.minDate = new Date(this.validations.min);
        this.minDate.setHours(0, 0, 0, 0);
      }
      if (this.validations.maxActive) {
        this.maxDate = new Date(this.validations.max);
        this.maxDate.setHours(23, 59, 59, 999);
      }
    }
  }
  
  getDefaultValue() {
    if (this.validations) {
      if (this.validations.minActive)
        return this.validations.min;
      else if (this.validations.maxActive)
        return this.validations.max;
    }
    return new Date();
  }
  
  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;
    
    let value = this.state.value;
    if (!value)
      return;
    
    if (this.validations &&
       (this.validations.minActive && value < this.validations.min ||
        this.validations.maxActive && value > this.validations.max)) {
      if (this.validations.errorMsg)
        return this.validations.errorMsg;
      return 'The date is out of range!';
    }
  }
  
  onChangeDate = _date => {
    const date = _date[0];
    const oldDate = this.state.value ? this.state.value : new Date();
    date.setHours(oldDate.getHours(), oldDate.getMinutes());
    this.setValue(date);
  };
  
  onChangeTime = _time => {
    const time = _time[0];
    const date = this.state.value ? this.state.value : new Date();
    date.setHours(time.getHours(), time.getMinutes());
    this.setValue(date);
  };
  
  getInput() {
    let value = this.state.value;
  
    switch (this.field.appearance) {
      case FIELD_APPEARANCE__DATE__DATE:
        return(
          <div styleName="input-wrapper data-time-wrapper">
            <div styleName="date">
              <Flatpickr value={value}
                         options={{
                           clickOpens: this.state.isEditable,
                           altInput: true,
                           minDate: this.minDate,
                           maxDate: this.maxDate
                         }}
                         onChange={this.onChangeDate} />
            </div>
            <div styleName="time">
              <Flatpickr value={value}
                         options={{
                           clickOpens: this.state.isEditable,
                           altInput: true,
                           noCalendar: true,
                           enableTime: true,
                           altFormat: "h:i K"
                         }}
                         onChange={this.onChangeTime} />
            </div>
          </div>
        );
        
      case FIELD_APPEARANCE__DATE__DATE_ONLY:
        return(
          <div styleName="input-wrapper data-time-wrapper">
            <div styleName="date">
              <Flatpickr value={value}
                         options={{
                           clickOpens: this.state.isEditable,
                           altInput: true,
                           minDate: this.minDate,
                           maxDate: this.maxDate
                         }}
                         onChange={this.onChangeDate} />
            </div>
          </div>
        );
  
      case FIELD_APPEARANCE__DATE__TIME_ONLY:
        return(
          <div styleName="input-wrapper data-time-wrapper">
            <div styleName="time">
              <Flatpickr value={value}
                         options={{
                           clickOpens: this.state.isEditable,
                           altInput: true,
                           noCalendar: true,
                           enableTime: true,
                           altFormat: "h:i K"
                         }}
                         onChange={this.onChangeTime} />
            </div>
          </div>
        );
    }
  }
  
}
