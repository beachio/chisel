import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import MarkdownEditor, {LAYOUT_SPLIT} from 'components/elements/MarkdownEditor/MarkdownEditor';

import styles from './MarkdownModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class MarkdownModal extends Component {
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
        <MarkdownEditor styleName="editor"
                        layout={LAYOUT_SPLIT}
                        value={this.text}
                        onChange={this.onChange} />
      </div>
    );
  }
}