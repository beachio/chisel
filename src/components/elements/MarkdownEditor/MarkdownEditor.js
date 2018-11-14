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
    mdeState: {markdown: ""},
  };
  onChange;
  layout = LAYOUT_TABS;
  converter = null;


  constructor(props) {
    super(props);

    if (props.value)
      this.state.mdeState.markdown = props.value;
    this.onChange = props.onChange;
    if (props.layout)
      this.layout = props.layout;

    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      simpleLineBreaks: true,
      tasklists: true,
      strikethrough: true
    });
  }

  componentWillReceiveProps(nextProps) {
    const {mdeState} = this.state;
    let value = nextProps.value ? nextProps.value : '';
    if (value == mdeState.markdown)
      return;

    DraftUtil.buildNewMdeState(mdeState, this.genPreview, value)
      .then(newState => this.setState({mdeState: newState}));
  }

  onChangeMde = mdeState => {
    const markdownOld = this.state.mdeState.markdown;
    this.setState({mdeState});
    if (mdeState.markdown != markdownOld)
      this.onChange(mdeState.markdown);
  };

  genPreview = markdown =>
    Promise.resolve(this.converter.makeHtml(markdown));

  render () {
    return (
      <ReactMde className={this.props.className}
                onChange={this.onChangeMde}
                editorState={this.state.mdeState}
                generateMarkdownPreview={this.genPreview}
                layout={this.layout} />
    );
  }
}