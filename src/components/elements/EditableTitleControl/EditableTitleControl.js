import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './EditableTitleControl.sss';


const MIN_TEXT = 'WWWW';

@CSSModules(styles, {allowMultiple: true})
export default class EditableTitleControl extends Component {
  state = {
    text: '',
    editing: false,
    width: 0
  };
  
  input = null;
  
  testTextElm = null;
  minTextWidth = 0;
  editable = false;
  
  startText = undefined;


  constructor(props) {
    super(props);

    this.startText = props.text;
    this.editable = !props.disabled && !!props.update;
  }

  setText(text) {
    text = text ? text : '';
    
    let wText = text;
    if (!wText)
      wText = this.props.placeholder;
    if (!wText)
      wText = MIN_TEXT;
    
    this.testTextElm.innerText = wText;
    let width = this.testTextElm.clientWidth + 15;
    if (width < this.minTextWidth)
      width = this.minTextWidth;

    this.setState({text, width});
  }

  componentDidMount() {
    this.testTextElm = document.createElement('div');
    const style = {
      fontSize: this.props.isSmall ? '12px' : '20px',
      fontFamily: "'Open Sans', sans-serif",
      opacity: '.01',
      position: 'absolute',
      top: 0,
      letterSpacing: this.props.isSmall ? '0.46px' : '0.83px',
      zIndex:'-1',
    };
    Object.assign(this.testTextElm.style, style);
    document.body.appendChild(this.testTextElm);
  
    this.testTextElm.innerText = MIN_TEXT;
    this.minTextWidth = this.testTextElm.clientWidth + 15;

    this.setText(this.props.text);
  }
  
  componentWillReceiveProps(nextProps) {
    const {text} = nextProps;

    //костыль для React 16.3.0
    if (this.startText == text)
      return;

    this.setText(text);
    this.startText = text;
    this.editable = !nextProps.disabled && !!nextProps.update;
  }

  componentWillUnmount() {
    document.body.removeChild(this.testTextElm);
  }

  onEditClick = () => {
    if (!this.editable || this.state.editing)
      return;

    this.setState(
      {editing: true},
      () => this.input.focus()
    );
  };

  onChange = event => {
    this.setText(event.target.value);
  };

  onBlur = () => {
    if (!this.editable || this.props.alertShowing)
      return;
  
    if (!this.props.required || this.state.text) {
      this.setState({editing: false});
      this.props.update(this.state.text, t => this.setText(t), true);
    } else if (this.props.required) {
      this.setText(this.startText);
    }
  };

  onKeyDown = event => {
    event.stopPropagation();
    if (this.props.alertShowing || !this.editable)
      return;

    //Enter pressed
    if (event.keyCode == 13) {
      if (!this.props.required || this.state.text) {
        this.setState({editing: false});
        this.props.update(this.state.text);
      }
      
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({editing: false});
      this.setText(this.startText);
    }
  };

  render() {
    const {placeholder, isSmall} = this.props;

    let wrapperStyle = "wrapper";
    if (this.editable)
      wrapperStyle += " wrapper-hover";

    let editable = this.editable && this.state.editing;
    let inputStyle = "input";
    if (editable)
      inputStyle += " input-editing";
    if (isSmall)
      inputStyle += " input-small";

    return (
      <div styleName={wrapperStyle}>
        <input style={{width: this.state.width + 'px'}}
               ref={input => this.input = input}
               styleName={inputStyle}
               value={this.state.text}
               readOnly={!editable}
               placeholder={placeholder}
               onBlur={this.onBlur}
               onChange={this.onChange}
               onKeyDown={this.onKeyDown} />
        {
          !this.state.editing &&
            <div styleName="edit"
                 onClick={this.onEditClick}>
              edit
            </div>
        }
      </div>
    );
  }
}
