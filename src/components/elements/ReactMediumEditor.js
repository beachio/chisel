import blacklist from 'blacklist';
import React from 'react';
import ReactDOM from 'react-dom';
import MediumEditor from 'medium-editor';


export default class ReactMediumEditor extends React.Component {
  static defaultProps = {
    tag: 'div'
  };

  dom;
  medium;
  text = '';
  inside = false;

  constructor (props) {
    super(props);

    this.state = {
      text: this.props.text
    };
    this.text = this.props.text;
  }

  componentDidMount () {
    this.dom = ReactDOM.findDOMNode(this);

    this.medium = new MediumEditor(this.dom, this.props.options);
    this.medium.subscribe('editableInput', e => {
      this.inside = true;
      this.text = this.dom.innerHTML;
      if (this.props.onChange)
        this.props.onChange(this.dom.innerHTML, this.medium);
    });
  }

  componentWillReceiveProps (nextProps) {
    //inside update: received old text
    if (this.inside && nextProps.text != this.text)
      return;

    //ignore same text
    if (nextProps.text == this.text) {
      this.inside = false;
      return;
    }

    //outside update
    this.setState({text: nextProps.text});
    this.text = nextProps.text;
  }

  componentWillUnmount () {
    this.medium.destroy();
  }

  render () {
    const tag = this.props.tag;
    const props = blacklist(this.props, 'options', 'text', 'tag', 'contentEditable', 'dangerouslySetInnerHTML');
    props.dangerouslySetInnerHTML = { __html: this.state.text };

    return React.createElement(tag, props);
  }
}
