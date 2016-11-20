import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import _ from 'lodash/core';

import styles from './SwitchControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SwitchControl extends Component {
  id = '0';
  
  componentWillMount() {
    this.id = _.uniqueId('switch_');
  }
  
  onChange = e => {
    const {onChange} = this.props;
    if (onChange)
      onChange(e.target.checked);
  };
  
  render() {
    const {title, checked} = this.props;
    return (
      <div styleName="SwitchControl">
        <input type="checkbox"
               styleName="checkbox"
               id={this.id}
               checked={checked}
               onChange={this.onChange}
        />
        <label styleName="label" htmlFor={this.id}>{title}</label>
      </div>
    );
  }
}
