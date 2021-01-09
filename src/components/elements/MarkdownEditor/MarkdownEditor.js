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

    MdEditor.use(Plugins.TabInsert, {
      tabMapValue: 2,
    });

/*    if (!props.fullHeight)
      MdEditor.use(Plugins.AutoResize, {
        min: 200, // min height
        max: 400
      });*/
  }

  renderHTML = text => {
    return this.mdParser.render(text);
  };

  onChange = ({html, text}) => {
    const {onChange} = this.props;
    onChange(text);
  };

  onImageUpload = (file) => {
    if (file.size > 50000)
      return new Promise(resolve => {
        setTimeout(() => resolve('THE FILE IS TOO LARGE!'), 10);
      });

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = data => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  render () {
    const {readOnly, value, fullHeight} = this.props;

    const style = {};
    if (fullHeight)
      style.height = '100%';
    else
      style.height = '250px';

    const config = {
      view: { menu: true, md: true, html: !!fullHeight },
      canView: {fullScreen: false}
    };

    return (
      <MdEditor
        style={style}
        config={config}
        value={value}
        readOnly={readOnly}
        renderHTML={this.renderHTML}
        onChange={this.onChange}
        onImageUpload={this.onImageUpload}
      />
    );
  }
}