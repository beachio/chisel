import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
class Sites extends Component {
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