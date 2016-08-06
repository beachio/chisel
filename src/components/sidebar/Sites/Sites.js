import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div styleName="sites">
        <div styleName="section header">
          <div styleName="title">Your sites</div>
          <div styleName="counter">1/10</div>
        </div>
        <div styleName="section list">
          {
            /// нужно сделать компонент list-item или че-то такое и запилить туда верстку
            /// которую я привел ниже.
            /// также желательно сразу впилить поддержку активного пункта и по клику менять его
          }
          <div styleName="element">
            <div styleName="icon">
              <InlineSVG src={require("./hammer.svg")} />
            </div>
            <div styleName="site-name">shugar.getforge.io</div>
            <a href="/" target="_blank">
              <InlineSVG styleName="link" src={require("./link.svg")} />
            </a>
          </div>
          <div styleName="element element-active">
            <div styleName="icon">
              <InlineSVG src={require("./hammer.svg")} />
            </div>
            <div styleName="site-name">keir.getforge.io</div>
            <a href="/" target="_blank">
              <InlineSVG styleName="link" src={require("./link.svg")} />
            </a>
          </div>
          <div styleName="element">
            <div styleName="icon">
              <InlineSVG src={require("./hammer.svg")} />
            </div>
            <div styleName="site-name">momplease.getforge.io</div>
            <a href="/" target="_blank">
              <InlineSVG styleName="link" src={require("./link.svg")} />
            </a>
          </div>
        </div>
        <div styleName="section new-site">
          <InlineSVG src={require("./plus.svg")} />
          Add new site
        </div>
      </div>
    );
  }
}
