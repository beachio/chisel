import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentBase extends Component {
  state = {
    error: null,
    value: null
  };
  
  field = null;
  isEditable = false;
  setFieldValue = null;
  
  
  constructor (props) {
    super(props);
    
    this.field = props.field;
    this.isEditable = props.isEditable;
    this.setFieldValue = props.setFieldValue;
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  }
  
  setValue(value, save) {
    //this.setState({value});
    this.setState({error: null});
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