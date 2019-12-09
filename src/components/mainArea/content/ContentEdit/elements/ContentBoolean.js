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
    const {value, field} = this.state;
    
    switch (field.appearance) {
      case ftps.FIELD_APPEARANCE__BOOLEAN__RADIO:
        const textYes = field.boolTextYes ? field.boolTextYes : 'Yes';
        const textNo  = field.boolTextNo  ? field.boolTextNo  : 'No';
  
        return (
          <div styleName="radio">
            <RadioControl name={field.nameId}
                          data={true}
                          value={value}
                          disabled={!isEditable}
                          label={textYes}
                          onChange={this.setValue} />
            <RadioControl name={field.nameId}
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
