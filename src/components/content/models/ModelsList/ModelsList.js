import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './ModelsList.sss';


@CSSModules(styles, {allowMultiple: true})
class ModelsList extends Component {
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