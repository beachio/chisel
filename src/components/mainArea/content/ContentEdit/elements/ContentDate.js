import React from 'react';
import CSSModules from 'react-css-modules';

import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';

import ContentBase from './ContentBase';

import {FIELD_APPEARANCE__DATE__DATE, FIELD_APPEARANCE__DATE__DATE_ONLY, FIELD_APPEARANCE__DATE__TIME_ONLY} from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentDate extends ContentBase {
  getDefaultValue() {
    return new Date();
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
    
    switch (this.field.appearance) {
      case FIELD_APPEARANCE__DATE__DATE:
        return(
          <div styleName="input-wrapper data-time-wrapper">
            <div styleName="date">
              <Flatpickr value={value}
                         data-click-opens={this.state.isEditable}
                         data-alt-input="true"
                         onChange={this.onChangeDate} />
            </div>
            <div styleName="time">
              <Flatpickr value={value}
                         data-click-opens={this.state.isEditable}
                         data-no-calendar={true}
                         data-enable-time={true}
                         data-alt-format="h:i K"
                         data-alt-input="true"
                         onChange={this.onChangeTime} />
            </div>
          </div>
        );
        
      case FIELD_APPEARANCE__DATE__DATE_ONLY:
        return(
          <div styleName="input-wrapper data-time-wrapper">
            <div styleName="date">
              <Flatpickr value={value}
                         data-click-opens={this.state.isEditable}
                         data-alt-input="true"
                         onChange={this.onChangeDate} />
            </div>
          </div>
        );
  
      case FIELD_APPEARANCE__DATE__TIME_ONLY:
        return(
          <div styleName="input-wrapper data-time-wrapper">
            <div styleName="time">
              <Flatpickr value={value}
                         data-click-opens={this.state.isEditable}
                         data-no-calendar={true}
                         data-enable-time={true}
                         data-alt-format="h:i K"
                         data-alt-input="true"
                         onChange={this.onChangeTime} />
            </div>
          </div>
        );
    }
  }
  
}
