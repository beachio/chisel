import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './ModelsList.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ModelsList extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="g-container" styleName="models">
        <div className="g-title">
          Models
        </div>
        <form>
          <div styleName="list">
            <div styleName="list-item list-header">
              <div styleName="type">
              </div>
              <div styleName="fields">
                FIELDS
              </div>
              <div styleName="updated">
                UPDATED
              </div>
            </div>

            <div styleName="list-item">
              <div styleName="type">
                <div styleName="title">Post</div>
                <div styleName="subtitle">A blog post or article content type</div>
              </div>
              <div styleName="fields">
                7
              </div>
              <div styleName="updated">
                3 Hours ago
              </div>
            </div>

            <div styleName="list-item">
              <div styleName="type">
                <div styleName="title">Page</div>
                <div styleName="subtitle">A static and standalone Page content type</div>
              </div>
              <div styleName="fields">
                7
              </div>
              <div styleName="updated">
                24 Mar
              </div>
            </div>
          </div>
          <div styleName="create-new">
            <input styleName="input" placeholder="Create a new Content Type" />
            <InlineSVG styleName="plus" src={require("./plus.svg")} />
          </div>
        </form>
      </div>
    );
  }
}
