import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './PayCard.sss';


@CSSModules(styles, {allowMultiple: true})
export class PayCard extends Component {
  render() {
    const {title, cost, sites, type, buttonText} = this.props

    return (
      <div styleName="card" key="1">
        <div styleName="card-title">
          {title}
        </div>
        <div styleName="card-cost">
          ${cost}<span>/mo</span>
        </div>
        <div styleName="card-sites">
          Sites
        </div>
        <div styleName="card-number">
          {sites}
        </div>
        <div styleName={`card-button ${type}`}>
          {buttonText}
        </div>
      </div>
    )
  }
}

export default PayCard