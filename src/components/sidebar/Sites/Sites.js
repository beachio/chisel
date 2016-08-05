import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  componentDidMount() {
  }
  
  render() {
    return (
      <div>
        <section styleName="section header">
          <div styleName="title">Your sites</div>
          <div styleName="counter">1/10</div>
        </section>
        <section styleName="section list">
          <div styleName="element">keir.getforge.io</div>
        </section>
        <section styleName="section new-site">
          <div>+ Add new site</div>
        </section>
      </div>
    );
  }
}