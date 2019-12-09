import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {checkUniqueFieldValue} from 'utils/data';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentBase extends Component {
  state = {
    error: null,
    value: this.props.value
  };
  
  field = this.props.field;


  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  }
  
  setValue = (value, save) => {
    this.setState({
      value,
      error: null
    });
    this.props.setFieldValue(this.field, value, save);
  };
  
  getError() {
    if (this.field.isRequired && this.state.value === undefined)
      return 'This field is required!';
    
    if (this.field.isUnique) {
      const item = checkUniqueFieldValue(this.field, this.props.item);
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
        {this.field.name}
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