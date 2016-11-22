import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import Editor from 'react-medium-editor';
// load theme styles with webpack
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

import styles from './WysiwygModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class WysiwygModal extends Component  {
  text = "";
  
  onChange = (text, medium) => {
    this.text = text;
  };
  
  render() {
    return (
      <div styleName="wrapper">
        <Editor
          styleName="editor"
          text={this.props.text}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
