import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

// load theme styles with webpack
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

import Editor from 'components/elements/ReactMediumEditor';

import styles from './WysiwygModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class WysiwygModal extends Component {
  text = "";
  onClose = null;
  callback = null;
  
  constructor(props) {
    super(props);
    
    this.onClose = props.onClose;
    this.callback = props.params.callback;
    this.text = props.params.text;
  }
  
  onClosing = () => {
    this.callback(this.text);
    this.onClose();
  };
  
  onChange = text => {
    this.text = text;
  };
  
  render() {
    return (
      <div styleName="wrapper">
        <div styleName="return" onClick={this.onClosing}>
          <InlineSVG styleName="cross"
                     src={require("assets/images/cross.svg")} />
        </div>
        <Editor styleName="editor"
                text={this.text}
                onChange={this.onChange} />
      </div>
    );
  }
}