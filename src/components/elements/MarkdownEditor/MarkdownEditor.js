import React, {Component} from 'react';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import CSSModules from 'react-css-modules';
import styles from './MarkdownEditor.sss';
import 'react-mde/lib/styles/css/react-mde-all.css';


export const LAYOUT_TABS  = "MARKDOWN_LAYOUT_TABS";
export const LAYOUT_SPLIT = "MARKDOWN_LAYOUT_SPLIT";

@CSSModules(styles, {allowMultiple: true})
export default class MarkdownEditor extends Component {
  state = {
    mdeState: { markdown: ""}
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

  onChangeMde = mdeState => {
    this.setState({mdeState});
    this.onChange(mdeState.markdown);
  };

  render () {
    return (
      <div>
        <ReactMde
          onChange={this.onChangeMde}
          editorState={this.state.mdeState}
          layout="noPreview"
        />
      </div>
    );
  }
}