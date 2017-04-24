import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Editor from 'react-medium-editor';
// load theme styles with webpack
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

import styles from './WysiwygModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class WysiwygModal extends Component  {
  text = "";
  onClose = null;
  callback = null;
  
  componentWillMount() {
    this.onClose = this.props.onClose;
    this.callback = this.props.params.callback;
  }
  
  onClosing = () => {
    this.callback(this.text);
    this.onClose();
  };
  
  onChange = (text, medium) => {
    this.text = text;
  };
  
  render() {
    return (
      <div styleName="wrapper">
        <div styleName="return" onClick={this.onClosing}>
          <InlineSVG styleName="cross"
                     src={require("assets/images/cross.svg")}/>
        </div>
        <Editor
          styleName="editor"
          text={this.props.params.text}
          onChange={this.onChange}
        />
      </div>
    );
  }
}