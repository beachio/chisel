import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import InputControl from "components/elements/InputControl/InputControl";
import DropdownControl from "components/elements/DropdownControl/DropdownControl";
import InputNumberControl from "components/elements/InputNumberControl/InputNumberControl";
import {BYTES, DATA_UNITS, convertDataUnits, FILE_TYPES} from 'utils/common';
import {FILE_SIZE_MAX} from 'ConnectConstants';

import styles from '../FieldModal.sss';




@CSSModules(styles, {allowMultiple: true})
export default class ValidationMedia extends Component {
  state = {
    fileSize: {
      active: false,
      min: 0,
      max: 0,
      minActive: true,
      maxActive: true,
      minUnit: BYTES,
      maxUnit: BYTES,
      errorMsg: '',
      isError: false
    },
    fileTypes: {
      active: false,
      types: [],
      errorMsg: '',
      isError: false
    }
  };
  
  maxForMin = FILE_SIZE_MAX;
  maxForMax = FILE_SIZE_MAX;
  
  typesSet = new Set();
  
  
  constructor(props) {
    super(props);
    
    Object.assign(this.state, props.validations);
  
    const types = this.state.fileTypes.types;
    if (types && typeof types[Symbol.iterator] === 'function')
      this.typesSet = new Set(types);
  }
  
  onSizeActive = value => {
    this.setState({fileSize: {
        ...this.state.fileSize,
        active: value,
        isError: false
      }}, this.update);
  };
  
  onSizeMin = value => {
    this.setState({fileSize: {
        ...this.state.fileSize,
        min: value,
        isError: false
      }}, this.update);
  };
  
  onSizeMax = value => {
    this.setState({fileSize: {
        ...this.state.fileSize,
        max: value,
        isError: false
      }}, this.update);
  };
  
  onSizeMinActive = value => {
    let {maxActive} = this.state.fileSize;
    if (!value)
      maxActive = true;
    this.setState({fileSize: {
        ...this.state.fileSize,
        minActive: value,
        maxActive,
        isError: false
      }}, this.update);
  };
  
  onSizeMaxActive = value => {
    let {minActive} = this.state.fileSize;
    if (!value)
      minActive = true;
    this.setState({fileSize: {
        ...this.state.fileSize,
        maxActive: value,
        minActive,
        isError: false
      }}, this.update);
  };
  
  onSizeMinUnit = newMinUnit => {
    let {min, minUnit} = this.state.fileSize;
    
    min = convertDataUnits(min, minUnit, newMinUnit);
    this.maxForMin = convertDataUnits(FILE_SIZE_MAX, BYTES, newMinUnit);
    
    this.setState({fileSize: {
        ...this.state.fileSize,
        min,
        minUnit: newMinUnit,
        isError: false
      }}, this.update);
  };
  
  onSizeMaxUnit = newMaxUnit => {
    let {max, maxUnit} = this.state.fileSize;
  
    max = convertDataUnits(max, maxUnit, newMaxUnit);
    this.maxForMax = convertDataUnits(FILE_SIZE_MAX, BYTES, newMaxUnit);
    
    this.setState({fileSize: {
        ...this.state.fileSize,
        max,
        maxUnit: newMaxUnit,
        isError: false
      }}, this.update);
  };
  
  onSizeErrorMsg = event => {
    const {value} = event.target;
    this.setState({fileSize: {
        ...this.state.fileSize,
        errorMsg: value
      }}, this.update);
  };
  
  onTypesActive = value => {
    this.setState({fileTypes: {
        ...this.state.fileTypes,
        active: value,
        isError: false
      }}, this.update);
  };
  
  onTypesErrorMsg = event => {
    const {value} = event.target;
    this.setState({fileTypes: {
        ...this.state.fileTypes,
        errorMsg: value
      }}, this.update);
  };
  
  onTypeChange = (type, value) => {
    if (value)
      this.typesSet.add(type);
    else
      this.typesSet.delete(type);
    
    this.setState({fileTypes: {
        ...this.state.fileTypes,
        types: Array.from(this.typesSet),
        isError: false
      }}, this.update);
  };
  
  update = () => {
    this.props.update(this.state);
  };
  
  getErrors() {
    if (this.state.fileSize.active && this.state.fileSize.minActive && this.state.fileSize.maxActive) {
      const min = convertDataUnits(this.state.fileSize.min, this.state.fileSize.minUnit, BYTES);
      const max = convertDataUnits(this.state.fileSize.max, this.state.fileSize.maxUnit, BYTES);
      const isError = min > max;
  
      if (isError) {
        this.setState({
          fileSize: {
            ...this.state.fileSize,
            isError: true
          }
        });
        return true;
      }
    }
  
    if (this.state.fileTypes.active && !this.state.fileTypes.types.length) {
      this.setState({
        fileTypes: {
          ...this.state.fileTypes,
          isError: true
        }
      });
      return true;
    }
    
    return false;
  }
  
  render() {
    return (
      <div>
        <div styleName="validation">
          <div styleName="switch">
            <CheckboxControl title="Accept only specified file size"
                             checked={this.state.fileSize.active}
                             onChange={this.onSizeActive} />
          </div>
          {this.state.fileSize.active &&
            <div>
              <div styleName="size">
                <CheckboxControl title="Min"
                                 checked={this.state.fileSize.minActive}
                                 onChange={this.onSizeMinActive}
                                 disabled={!this.state.fileSize.active}/>
                <div styleName="size-field">
                  <InputNumberControl onChange={this.onSizeMin}
                                      value={this.state.fileSize.min}
                                      isInt={true}
                                      min={0}
                                      max={this.maxForMin}
                                      readOnly={!this.state.fileSize.active || !this.state.fileSize.minActive}/>
                </div>
                <div styleName="size-unit">
                  <DropdownControl disabled={!this.state.fileSize.active || !this.state.fileSize.minActive}
                                   suggestionsList={DATA_UNITS}
                                   suggest={this.onSizeMinUnit}
                                   current={this.state.fileSize.minUnit}/>
                </div>
        
                <CheckboxControl title="Max"
                                 checked={this.state.fileSize.maxActive}
                                 onChange={this.onSizeMaxActive}
                                 disabled={!this.state.fileSize.active}/>
                <div styleName="size-field">
                  <InputNumberControl onChange={this.onSizeMax}
                                      value={this.state.fileSize.max}
                                      isInt={true}
                                      min={0}
                                      max={this.maxForMax}
                                      readOnly={!this.state.fileSize.active || !this.state.fileSize.maxActive}/>
                </div>
                <div styleName="size-unit">
                  <DropdownControl disabled={!this.state.fileSize.active || !this.state.fileSize.maxActive}
                                   suggestionsList={DATA_UNITS}
                                   suggest={this.onSizeMaxUnit}
                                   current={this.state.fileSize.maxUnit}/>
                </div>
              </div>
              <InputControl label="Custom error message"
                            onChange={this.onSizeErrorMsg}
                            value={this.state.fileSize.errorMsg}
                            readOnly={!this.state.fileSize.active}/>
              {this.state.fileSize.isError &&
                <div styleName="error">
                  Error: the min value should be smaller than max value! Please, fix it.
                </div>
              }
            </div>
          }
        </div>
  
        <div styleName="validation">
          <div styleName="active">
            <CheckboxControl title="Accept only specified file types"
                             checked={this.state.fileTypes.active}
                             onChange={this.onTypesActive} />
          </div>
          {this.state.fileTypes.active &&
            <div>
              <div styleName="file-types">
                {FILE_TYPES.map(type =>
                  <div styleName="file-types-checkbox"
                       key={type}>
                    <CheckboxControl title={type}
                                     checked={this.typesSet.has(type)}
                                     onChange={value => this.onTypeChange(type, value)}
                                     disabled={!this.state.fileTypes.active}/>
                  </div>
                )}
              </div>
              <InputControl label="Custom error message"
                            onChange={this.onTypesErrorMsg}
                            value={this.state.fileTypes.errorMsg}
                            readOnly={!this.state.fileTypes.active}/>
              {this.state.fileTypes.isError &&
                <div styleName="error">
                  Error: you should select at least one file type.
                </div>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}
