import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import MarkdownEditor, {LAYOUT_SPLIT} from 'components/elements/MarkdownEditor/MarkdownEditor';

import styles from './MarkdownModal.sss';

import ImageCrossCircle from 'assets/images/cross-circle.svg';


@CSSModules(styles, {allowMultiple: true})
export default class MarkdownModal extends Component {
  text = this.props.params.text;


  onClosing = () => {
    this.props.params.callback(this.text);
    this.props.onClose();
  };
  
  onChange = text => {
    this.text = text;
  };
  
  render() {
    const {readOnly} = this.props.params;
    
    return (
      <div styleName="wrapper">
        <div styleName="return" onClick={this.onClosing}>
          <InlineSVG styleName="cross"
                     src={ImageCrossCircle} />
        </div>
        <MarkdownEditor layout={LAYOUT_SPLIT}
                        value={this.text}
                        readOnly={readOnly}
                        onChange={this.onChange} />
      </div>
    );
  }
}