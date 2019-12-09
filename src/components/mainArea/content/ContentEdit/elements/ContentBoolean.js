import React from 'react';
import CSSModules from 'react-css-modules';

import ContentBase from './ContentBase';
import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import RadioControl from 'components/elements/RadioControl/RadioControl';

import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentBoolean extends ContentBase {
  getInput() {
    const {isEditable} = this.props;
    let value = this.state.value;
    
    switch (this.field.appearance) {
      case ftps.FIELD_APPEARANCE__BOOLEAN__RADIO:
        const textYes = this.field.boolTextYes  ?  this.field.boolTextYes : 'Yes';
        const textNo  = this.field.boolTextNo   ?  this.field.boolTextNo  : 'No';
  
        return (
          <div styleName="radio">
            <RadioControl name={this.field.nameId}
                          data={true}
                          value={value}
                          disabled={!isEditable}
                          label={textYes}
                          onChange={this.setValue} />
            <RadioControl name={this.field.nameId}
                          data={false}
                          value={value}
                          disabled={!isEditable}
                          label={textNo}
                          onChange={this.setValue} />
            {isEditable &&
              <div styleName="clear"
                   onClick={() => this.setValue(undefined)}>
                Reset
              </div>
            }
          </div>
        );
    
      case ftps.FIELD_APPEARANCE__BOOLEAN__SWITCH:
        return (
          <div styleName="switch">
            <div styleName="switch-wrapper">
              <SwitchControl checked={value}
                             disabled={!isEditable}
                             onChange={this.setValue} />
            </div>
            {isEditable &&
              <div styleName="clear"
                   onClick={() => this.setValue(undefined)}>
                Reset
              </div>
            }
          </div>
        );
    }
  }
}
