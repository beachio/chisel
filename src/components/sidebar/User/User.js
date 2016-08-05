import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './User.sss';


@CSSModules(styles, {allowMultiple: true})
class User extends Component {
  componentDidMount() {
  }
  
  render() {
    return (
      <div>
        lalala
      </div>
    );
  }
}