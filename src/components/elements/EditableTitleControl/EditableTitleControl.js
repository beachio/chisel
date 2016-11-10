import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './EditableTitleControl.sss';


const MIN_TEXT = '1234567890';

@CSSModules(styles, {allowMultiple: true})
export default class EditableTitleControl extends Component {
  state = {
    text: '',
    editing: false,
    width: 0
  };
  testTextElm = null;
  
  
  setText(text) {
    let wText = text;
    if (!wText)
      wText = this.props.placeholder;
    if (!wText || wText.length < MIN_TEXT.length)
      wText = MIN_TEXT;
    
    this.testTextElm.innerText = wText;
    let width = this.testTextElm.clientWidth * 1.1;
    
    this.setState({text, width});
  }
  
  componentWillReceiveProps(nextProps) {
    this.setText(nextProps.text);
  }
  
  componentDidMount() {
    this.testTextElm = document.createElement('div');
    this.testTextElm.style.fontSize = this.props.isSmall ? '12px' : '20px';
    this.testTextElm.style.opacity = '.01';
    this.testTextElm.style.position = 'absolute';
    this.testTextElm.style.top = '0';
    this.testTextElm.style.left = '0';
    this.testTextElm.style.zIndex = '-1';
    document.body.appendChild(this.testTextElm);
  
    this.setText(this.props.text);
  }
    
  onEditClick = () => {
    this.setState(
      {editing: true},
      () => this.refs.input.focus()
    );
  };
  
  onChange = event => {
    this.setText(event.target.value);
  };
  
  onBlur = () => {
    this.setState({editing: false});
    this.props.cancel();
  };
  
  onKeyDown = event => {
    if (this.props.alertShowing)
      return;
    
    //Enter pressed
    if (event.keyCode == 13) {
      this.props.update(this.title);
      //Esc pressed
    } else if (event.keyCode == 27) {
      this.props.cancel();
    }
  };
  
  render() {
    const {placeholder, isSmall} = this.props;
  
    let styleName = "input";
    if (this.state.editing)
      styleName += " input-editing";
    if (isSmall)
      styleName += " input-small";
    
    return (
      <div styleName="wrapper">
        <input style={{width: this.state.width + 'px'}}
               ref="input"
               styleName={styleName}
               value={this.state.text}
               readOnly={!this.state.editing}
               placeholder={placeholder}
               onBlur={this.onBlur}
               onChange={this.onChange}
               onKeyDown={this.onKeyDown} />
        <div styleName="edit"
             onClick={this.onEditClick}>
          edit
        </div>
      </div>
    );
  }
}