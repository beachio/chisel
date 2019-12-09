import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {checkUniqueFieldValue} from 'utils/data';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentBase extends Component {
  state = {
    item:  this.props.item,
    field: this.props.field,
    value: this.props.value,
    error: null
  };


  static getDerivedStateFromProps(props, state) {
    if (props.field != state.field || props.item != state.item)
      return {
        item:  props.item,
        field: props.field,
        value: props.value
      };
    return null;
  }
  
  setValue = (value, save) => {
    this.setState({
      value,
      error: null
    });
    this.props.setFieldValue(this.state.field, value, save);
  };
  
  getError() {
    if (this.state.field.isRequired && this.state.value === undefined)
      return 'This field is required!';
    
    if (this.state.field.isUnique) {
      const item = checkUniqueFieldValue(this.state.field, this.props.item);
      if (item) {
        if (item.title)
          return `This field value must be unique! The "${item.title}" item has same value.`;
        else
          return `This field value must be unique! There is an untitled item with same value.`;
      }
    }
    
    return null;
  }
  
  validate () {
    let error = this.getError();
    this.setState({error});
    return !error;
  }
  
  getTitle() {
    return (
      <div styleName="field-title">
        {this.state.field.name}
      </div>
    );
  }
  
  //must be overriden
  getInput() {
    return null;
  }
  
  render() {
    return (
      <div styleName="field">
        {this.getTitle()}
        {this.getInput()}
        <div styleName="field-error">
          {this.state.error}
        </div>
      </div>
    );
  }
}