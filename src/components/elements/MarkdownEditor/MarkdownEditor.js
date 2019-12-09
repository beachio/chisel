import React, {Component} from 'react';
import ReactMde, {DraftUtil} from "react-mde";
import * as Showdown from "showdown";
import CSSModules from 'react-css-modules';
import styles from './MarkdownEditor.sss';
import 'react-mde/lib/styles/css/react-mde-all.css';


export const LAYOUT_TABS  = "tabbed";
export const LAYOUT_SPLIT = "horizontal";


@CSSModules(styles, {allowMultiple: true})
export default class MarkdownEditor extends Component {
  state = {
    mdeState: {markdown: this.props.value ? this.props.value : ""},
  };
  layout = this.props.layout ? this.props.layout : LAYOUT_TABS;

  converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    simpleLineBreaks: true,
    tasklists: true,
    strikethrough: true
  });


  async componentDidUpdate(prevProps) {
    if (this.props == prevProps)
      return;

    const {mdeState} = this.state;
    const value = this.props.value ? this.props.value : '';
    if (value == mdeState.markdown)
      return;

    const newState = await DraftUtil.buildNewMdeState(mdeState, this.genPreview, value);
    this.setState({mdeState: newState});
  }

  onChangeMde = mdeState => {
    const markdownOld = this.state.mdeState.markdown;
    this.setState({mdeState});
    if (mdeState.markdown != markdownOld)
      this.props.onChange(mdeState.markdown);
  };

  genPreview = markdown =>
    Promise.resolve(this.converter.makeHtml(markdown));

  render () {
    const {readOnly} = this.props;
    
    return (
      <ReactMde className={this.props.className}
                onChange={this.onChangeMde}
                editorState={this.state.mdeState}
                generateMarkdownPreview={this.genPreview}
                layout={this.layout}
                readOnly={readOnly} />
    );
  }
}