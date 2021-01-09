import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

import styles from './MarkdownEditor.sss';



@CSSModules(styles, {allowMultiple: true})
export default class MarkdownEditor extends Component {
  mdParser = new MarkdownIt();

  constructor(props) {
    super();

    MdEditor.unuse(Plugins.FullScreen);

    MdEditor.use(Plugins.TabInsert, {
      tabMapValue: 2,
    });

/*    if (!props.fullHeight)
      MdEditor.use(Plugins.AutoResize, {
        min: 200, // min height
        max: 400
      });*/
  }

  onChange = ({html, text}) => {
    const {onChange} = this.props;
    onChange(text);
  };

  render () {
    const {readOnly, value, fullHeight} = this.props;

    const style = {};
    if (fullHeight)
      style.height = '100%';
    else
      style.height = '250px';

    return (
      <MdEditor
        style={style}
        value={value}
        readOnly={readOnly}
        renderHTML={text => this.mdParser.render(text)}
        onChange={this.onChange}
      />
    );
  }
}