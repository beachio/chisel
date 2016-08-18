import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentEdit extends Component {
  render() {
    return (
      <div className="g-container" styleName="ContentEdit">
        <div className="g-title" styleName="header">
          <div styleName="back">Back</div>
          20 Best Things You May Be Searching For
        </div>
        <div styleName="content">
          <div styleName="field">
            <div styleName="field-title">
              slug
            </div>
            <input styleName="title-input" placeholder="Post"/>
          </div>

          <div styleName="field">
            <div styleName="field-title">
              bannerImage
            </div>
            <div styleName="image">
              <form styleName="fileUpload" enctype="multipart/form-data" method="post">
               <input styleName="fileUpload-input" type="file" />
              </form>
            </div>
          </div>

          <div styleName="field">
            <div styleName="field-title">
              body
              <InlineSVG styleName="link" src={require("./link.svg")} />
            </div>
            <textarea styleName="textarea" placeholder="This is a post">
            </textarea>
          </div>

          <div styleName="field">
            <div styleName="field-title">
              showAuthor
            </div>
            <div styleName="radio-wrapper">
              <div styleName="radio-button">
                <input styleName="radio" type="radio" id="radio01" name="radio"/>
                <label styleName="radio-label" htmlFor="radio01">Yes</label>
              </div>
              <div styleName="radio-button">
                <input styleName="radio" type="radio" id="radio02" name="radio" />
                <label styleName="radio-label" htmlFor="radio02">No</label>
              </div>
            </div>
          </div>

          <div styleName="field">
            <div styleName="field-title">
              Authors
            </div>
            <div styleName="input-wrapper">
              <input styleName="input" placeholder="Steve Schofield"/>
              <input styleName="input" placeholder="Boris Adimov"/>
            </div>
          </div>

          <div styleName="field">
            <div styleName="field-title">
              footerComponent
            </div>
            <div styleName="input-wrapper">
              <input styleName="input" placeholder="Footer"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
