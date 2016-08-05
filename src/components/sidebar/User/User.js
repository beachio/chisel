import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './User.sss';


@CSSModules(styles, {allowMultiple: true})
export default class User extends Component {
  componentDidMount() {
  }
  
  render() {
    return (
      <div>
        Kein Ansell
      </div>
    );
  }
}