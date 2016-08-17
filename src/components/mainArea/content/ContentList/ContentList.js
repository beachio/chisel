import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './ContentList.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentList extends Component {
  render() {
    return (
      <div className="g-container" styleName="ContentList">
        <div className="g-title">
          Content
        </div>
        <div>
          <div styleName="list">
            <div styleName="list-item list-header">
              <div styleName="colorLabel"></div>
              <div styleName="type"></div>
              <div styleName="updated">UPDATED</div>
            </div>

            <div styleName="list-item">
              <div styleName="colorLabel"></div>
              <div styleName="type">
                <div styleName="name">20 Best Things You May Be Searching For</div>
                <div styleName="description">Post</div>
              </div>
              <div styleName="updated">3 hours ago</div>
            </div>

            <div styleName="list-item">
              <div styleName="colorLabel"></div>
              <div styleName="type">
                <div styleName="name">About us</div>
                <div styleName="description">Page</div>
              </div>
              <div styleName="updated">24 Mar</div>
            </div>

          </div>
          <form styleName="create-new">
            <input styleName="input" placeholder="Create a new Content Type" />
            <InlineSVG styleName="plus" src={require("./plus.svg")} />
          </form>
        </div>
      </div>
    );
  }
}
