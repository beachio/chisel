import React from 'react';
import CSSModules from 'react-css-modules';
import _ from 'lodash/core';

import ContentBase from './ContentBase';
import SwitchControl from 'components/elements/SwitchControl/SwitchControl';

import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentBoolean extends ContentBase {
  constructor(props) {
    super(props);
    
    let value = props.value;
    this.state.value = value ? value : false;
  }
  
  onChange(value) {
    this.setValue(value);
  }
  
  getInput() {
    let value = this.state.value;
    
    switch (this.field.appearance) {
      case ftps.FIELD_APPEARANCE__BOOLEAN__RADIO:
        let id1 = _.uniqueId('radio1_');
        let id2 = _.uniqueId('radio2_');
        return (
          <div styleName="radio-wrapper">
            <div styleName="radio-button">
              <input styleName="radio"
                     type="radio"
                     id={id1}
                     name="radio"
                     checked={value}
                     onChange={e => this.onChange(true)} />
              <label styleName="radio-label" htmlFor={id1}>Yes</label>
            </div>
            <div styleName="radio-button">
              <input styleName="radio"
                     type="radio"
                     id={id2}
                     name="radio"
                     checked={!value}
                     onChange={e => this.onChange(false)} />
              <label styleName="radio-label" htmlFor={id2}>No</label>
            </div>
          </div>
        );
    
      case ftps.FIELD_APPEARANCE__BOOLEAN__SWITCH:
        return (
          <div styleName="switch-wrapper">
            <SwitchControl checked={value} onChange={this.isEditable ? this.onChange : null}/>
          </div>
        );
    }
  }
  
}
