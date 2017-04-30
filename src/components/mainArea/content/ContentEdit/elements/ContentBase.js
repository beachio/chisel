import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentBase extends Component {
  state = {
    error: null,
    value: null,
    isEditable: false
  };
  
  field = null;
  setFieldValue = null;
  
  
  constructor (props) {
    super(props);
    
    this.field = props.field;
    this.setFieldValue = props.setFieldValue;
    
    this.state.isEditable = props.isEditable;
    if (props.value)
      this.state.value = props.value;
    else
      this.state.value = this.getDefaultValue();
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({isEditable: nextProps.isEditable});
    if (nextProps.value)
      this.setState({value: nextProps.value});
    else
      this.setState({value: this.getDefaultValue()});
  }
  
  getDefaultValue() {
    return null;
  }
  
  setValue(value, save) {
    this.setState({
    //  value,
      error: null
    });
    this.setFieldValue(this.field, value, save);
  }
  
  getError() {
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