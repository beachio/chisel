import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import InlineSVG from 'svg-inline-react';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="g-container" styleName="models">
        <div styleName="header">
          <div styleName="back">Back</div>
          <div styleName="header-title">Post</div>
          <div styleName="header-subtitle">A blog post or article content type</div>
        </div>
        <form>
          <div styleName="list">
            <div styleName="list-item">
              <div styleName="list-type">
                <div styleName="list-title">Title</div>
                <div styleName="list-subtitle">Short Text</div>
              </div>
            </div>
            <div styleName="list-item">
              <div styleName="list-type">
                <div styleName="list-title">Body</div>
                <div styleName="list-subtitle">Long Text</div>
              </div>
            </div>
          </div>

          <div styleName="create-new">
            <input styleName="input" placeholder="Add New Field" />
            <InlineSVG styleName="plus" src={require("./plus.svg")} />
          </div>
        </form>
      </div>
    );
  }
}
