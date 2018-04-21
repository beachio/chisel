import React, {Component} from 'react';
import ReactMde, {DraftUtil} from "react-mde";
import * as Showdown from "showdown";
import CSSModules from 'react-css-modules';
import styles from './MarkdownEditor.sss';
import 'react-mde/lib/styles/css/react-mde-all.css';


export const LAYOUT_TABS  = "MARKDOWN_LAYOUT_TABS";
export const LAYOUT_SPLIT = "MARKDOWN_LAYOUT_SPLIT";

export const TAB_CODE     = "MARKDOWN_TAB_CODE";
export const TAB_PREVIEW  = "MARKDOWN_TAB_PREVIEW";


@CSSModules(styles, {allowMultiple: true})
export default class MarkdownEditor extends Component {
  state = {
    mdeState: {markdown: ""},
    tab: TAB_CODE
  };
  onChange;
  layout = LAYOUT_TABS;
  converter = null;


  constructor(props) {
    super(props);

    this.state.mdeState.markdown = props.value;
    this.onChange = props.onChange;
    if (props.layout)
      this.layout = props.layout;

    this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true, simpleLineBreaks: true});
  }

  componentWillReceiveProps(nextProps) {
    const {mdeState} = this.state;
    if (nextProps.value == mdeState.markdown)
      return;

    DraftUtil.buildNewMdeState(mdeState, null, nextProps.value)
      .then(newState => this.setState({mdeState: newState}));
  }

  onChangeMde = mdeState => {
    this.setState({mdeState});
    this.onChange(mdeState.markdown);
  };

  render () {
    let html;

    switch (this.layout) {

      case LAYOUT_TABS:
        let content = null;
        switch (this.state.tab) {
          case TAB_CODE:
            content = (
              <ReactMde styleName="tabs-code"
                        onChange={this.onChangeMde}
                        editorState={this.state.mdeState}
                        layout="noPreview" />
            );
            break;

          case TAB_PREVIEW:
            html = this.converter.makeHtml(this.state.mdeState.markdown);
            content = (
              <div styleName="tabs-preview">
                <div dangerouslySetInnerHTML={{__html: html}} />
              </div>
            );
            break;
        }

        return (
          <div>
            <div>
              <button onClick={() => this.setState({tab: TAB_CODE})}>Code</button>
              <button onClick={() => this.setState({tab: TAB_PREVIEW})}>Preview</button>
            </div>
            {content}
          </div>
        );


      case LAYOUT_SPLIT:
        html = this.converter.makeHtml(this.state.mdeState.markdown);

        return (
          <div styleName="split">
            <ReactMde styleName="side-code"
                      onChange={this.onChangeMde}
                      editorState={this.state.mdeState}
                      layout="noPreview" />
            <div styleName="side-preview">
              <div dangerouslySetInnerHTML={{__html: html}} />
            </div>
          </div>
        );
    }

    return null;
  }
}