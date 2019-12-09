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
  minDateFull;
  maxDateFull;
  minDate;
  maxDate;
  minTime = new Date(0);
  maxTime = new Date(0);
  
  
  constructor(props) {
    super(props);
  
    this.minTime.setHours(0, 0, 0, 0);
    this.maxTime.setHours(23, 59, 59, 999);
    
    if (this.field.validations && this.field.validations.rangeDate && this.field.validations.rangeDate.active) {
      this.validations = this.field.validations.rangeDate;
  
      if (this.validations.minActive) {
        this.minDateFull = new Date(this.validations.min);
        
        if (this.field.appearance == FIELD_APPEARANCE__DATE__TIME_ONLY) {
          this.minTime.setHours(this.minDateFull.getHours(), this.minDateFull.getMinutes());
        } else {
          this.minDate = new Date(this.minDateFull);
          this.minDate.setHours(0, 0, 0, 0);
        }
      }
      if (this.validations.maxActive) {
        this.maxDateFull = new Date(this.validations.max);
  
        if (this.field.appearance == FIELD_APPEARANCE__DATE__TIME_ONLY) {
          this.maxTime.setHours(this.maxDateFull.getHours(), this.maxDateFull.getMinutes());
        } else {
          this.maxDate = new Date(this.maxDateFull);
          this.maxDate.setHours(23, 59, 59, 999);
        }
      }
    }
  }
  
  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;
    
    let value = this.state.value;
    if (!value)
      return;
    
    if (!this.validations)
      return;
    
    switch (this.field.appearance) {
      case FIELD_APPEARANCE__DATE__TIME_ONLY:
        if (value < this.minTime || value > this.maxTime) {
          if (this.validations.errorMsg)
            return this.validations.errorMsg;
          return 'The time is out of range!';
        }
        break;
      default:
        if (this.validations.minActive && value < this.minDateFull ||
            this.validations.maxActive && value > this.maxDateFull) {
          if (this.validations.errorMsg)
            return this.validations.errorMsg;
          return 'The date/time is out of range!';
        }
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
    const date = this.state.value ? this.state.value : new Date(0);
    date.setHours(time.getHours(), time.getMinutes());
    this.setValue(date);
  };
  
  onClickTime = () => {
    const time = new Date(0);
    time.setHours(0);
    this.onChangeTime([time]);
  };
  
  getInput() {
    const {isEditable} = this.props;
    let value = this.state.value;
    
    let styleWrapper = 'input-wrapper data-time-wrapper';
    if (!isEditable)
      styleWrapper += ' data-time-disabled';
  
    switch (this.field.appearance) {
      case FIELD_APPEARANCE__DATE__DATE:
        return(
          <div styleName={styleWrapper}>
            <div styleName="date">
              <Flatpickr value={value}
                         options={{
                           clickOpens: isEditable,
                           altInput: true,
                           minDate: this.minDate,
                           maxDate: this.maxDate
                         }}
                         onChange={this.onChangeDate} />
            </div>
            <div styleName="time">
              <Flatpickr value={value}
                         options={{
                           clickOpens: isEditable,
                           altInput: true,
                           noCalendar: true,
                           enableTime: true,
                           altFormat: "h:i K",
                           minDate: this.minDateFull,
                           maxDate: this.maxDateFull
                         }}
                         onChange={this.onChangeTime} />
            </div>
          </div>
        );
        
      case FIELD_APPEARANCE__DATE__DATE_ONLY:
        return(
          <div styleName={styleWrapper}>
            <div styleName="date">
              <Flatpickr value={value}
                         options={{
                           clickOpens: isEditable,
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
          <div styleName={styleWrapper}>
            <div styleName="time" onClick={this.onClickTime}>
              <Flatpickr value={value}
                         options={{
                           clickOpens: isEditable,
                           altInput: true,
                           noCalendar: true,
                           enableTime: true,
                           altFormat: "h:i K",
                           minDate: this.minTime,
                           maxDate: this.maxTime
                         }}
                         onChange={this.onChangeTime} />
            </div>
          </div>
        );
    }
  }
  
}
