import React from 'react';
import CSSModules from 'react-css-modules';
import ReactStars from 'react-stars';

import ContentBase from './ContentBase';
import InputNumberControl from 'components/elements/InputNumberControl/InputNumberControl';
import DynamicListComponent from "components/elements/DynamicListComponent/DynamicListComponent";
import DropdownControl from "components/elements/DropdownControl/DropdownControl";
import * as ftps from 'models/ModelData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentNumber extends ContentBase {
  constructor (props) {
    super(props);

    if (!this.state.value && this.state.field.isList)
      this.state.value = [];
  }

  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;

    let {value, field} = this.state;

    const checkRangeValidation = () => {
      if (!field.validations)
        return null;
      if (!field.validations.range || !field.validations.range.active)
        return null;

      const range = field.validations.range;

      const checkRange = value => {
        if (range.minActive && value < range.min ||
            range.maxActive && value > range.max) {
          let error = range.errorMsg;
          if (!error)
            error = `The value(s) is out of the permissible range: ${range.min} – ${range.max}!`;
          return error;
        }
      };

      if (field.isList) {
        for (let itemValue of value) {
          let error = checkRange(itemValue);
          if (error)
            return error;
        }
      } else {
        if (!value)
          value = 0;
        return checkRange(value);
      }
    };

    switch (field.type) {
      case ftps.FIELD_TYPE_FLOAT:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
            let error = checkRangeValidation();
            if (error)
              return error;
            break;
        }
        break;

      case ftps.FIELD_TYPE_INTEGER:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
            let error = checkRangeValidation();
            if (error)
              return error;

            break;

          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            break;
        }
        break;
    }

    return null;
  }

  onChange = value => {
    this.setValue(value);
  };

  onChangeRating = value => {
    value *= 2;
    this.setValue(value);
  };

  onChangeDropdown = (v, i) => {
    if (i === undefined) {
      this.setValue(v);

    } else {
      let list = this.state.value ? this.state.value : [];
      if (v === undefined)
        list = list.slice(0, i).concat(list.slice(i + 1));
      else
        list[i] = v;
      this.setValue(list);
    }
  };

  getInput() {
    const {isEditable} = this.props;
    let {value, field} = this.state;

    switch (field.type) {
      case ftps.FIELD_TYPE_FLOAT:
      case ftps.FIELD_TYPE_INTEGER:

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:

            let inner;

            if (field.isList) {
              inner = <DynamicListComponent values={value}
                                            onChange={this.onChange}
                                            readOnly={!isEditable}
                                            numeric
                                            numericInt={field.type == ftps.FIELD_TYPE_INTEGER} />;
            } else {
              inner = <InputNumberControl type="big"
                                          isInt={field.type == ftps.FIELD_TYPE_INTEGER}
                                          value={value}
                                          readOnly={!isEditable}
                                          onChange={this.onChange} />;
            }

            return (
              <div styleName="input-wrapper">
                {inner}
              </div>
            );

          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            if (value)
              value *= .5;
            return (
              <div styleName="rating">
                <ReactStars value={value}
                            onChange={this.onChangeRating}
                            size={32}
                            edit={isEditable}
                            color1={'#87878d'}
                            color2={'#8a5ebe'} />
                {isEditable &&
                  <div styleName="clear"
                       onClick={() => this.setValue(undefined)}>
                    Reset
                  </div>
                }
              </div>
            );

          case ftps.FIELD_APPEARANCE__INTEGER__DROPDOWN:
          case ftps.FIELD_APPEARANCE__FLOAT__DROPDOWN:
            const getElement = (v, i) => (
              <div styleName="dropdown-wrapper" key={i}>
                <div styleName="dropdown">
                  <DropdownControl disabled={!isEditable}
                                   list={field.validValues}
                                   onSuggest={_v => this.onChangeDropdown(_v, i)}
                                   current={v}/>
                </div>
                {isEditable &&
                  <div styleName="clear"
                       style={{visibility: v === undefined ? 'hidden' : 'visible'}}
                       onClick={() => this.onChangeDropdown(undefined, i)}>
                    Reset
                  </div>
                }
              </div>
            );

            if (!field.isList)
              return getElement(value);

            if (!value)
              return getElement(undefined, 0);

            return (
              <div>
                {value.map(getElement)}
                {getElement(undefined, value.length)}
              </div>
            );

        }
    }
  }

}
