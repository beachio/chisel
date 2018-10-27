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
  
  constructor(props) {
    super(props);
    
    if (this.field.validations && this.field.validations.rangeDate && this.field.validations.rangeDate.active)
      this.validations = this.field.validations.rangeDate;
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
    let date = _date[0];
    let oldDate = this.state.value;
    if (!oldDate)
      oldDate = new Date();
    date.setHours(oldDate.getHours());
    date.setMinutes(oldDate.getMinutes());
    this.setValue(date);
  };
  
  onChangeTime = _time => {
    let time = _time[0];
    let date = this.state.value;
    if (!date)
      date = new Date();
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    this.setValue(date);
  };
  
  getInput() {
    let value = this.state.value;
    let minDate = (this.validations && this.validations.minActive) ? this.validations.min : null;
    let maxDate = (this.validations && this.validations.maxActive) ? this.validations.max : null;
  
    switch (this.field.appearance) {
      case FIELD_APPEARANCE__DATE__DATE:
        return(
          <div styleName="input-wrapper data-time-wrapper">
            <div styleName="date">
              <Flatpickr value={value}
                         options={{
                           clickOpens: this.state.isEditable,
                           altInput: true,
                           minDate,
                           maxDate
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
                           minDate,
                           maxDate
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
