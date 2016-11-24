import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import {filterSpecials} from 'utils/common';

import styles from './EditableTitleControl.sss';


const MIN_TEXT = 'WWWW';

@CSSModules(styles, {allowMultiple: true})
export default class EditableTitleControl extends Component {
  state = {
    text: '',
    editing: false,
    width: 0
  };
  testTextElm = null;
  minTextWidth = 0;
  editable = false;


  setText(text) {
    let wText = text;
    if (!wText)
      wText = this.props.placeholder;
    if (!wText)
      wText = MIN_TEXT;
    wText = filterSpecials(wText);
    
    this.testTextElm.innerText = wText;
    let width = this.testTextElm.clientWidth * 1.1;
    if (width < this.minTextWidth)
      width = this.minTextWidth;

    this.setState({text, width});
  }

  componentWillReceiveProps(nextProps) {
    this.setText(nextProps.text);
  }

  componentDidMount() {
    this.testTextElm = document.createElement('div');
    let style = {
      fontSize: this.props.isSmall ? '12px' : '20px',
      fontFamily: "'Open Sans', sans-serif",
      opacity: '.01',
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex:'-1',
    };
    Object.assign(this.testTextElm.style, style);
    document.body.appendChild(this.testTextElm);
  
    this.testTextElm.innerText = MIN_TEXT;
    this.minTextWidth = this.testTextElm.clientWidth * 1.1;

    this.setText(this.props.text);

    this.editable = !!this.props.update;
  }

  onEditClick = () => {
    if (!this.editable)
      return;

    this.setState(
      {editing: true},
      () => this.refs.input.focus()
    );
  };

  onChange = event => {
    this.setText(event.target.value);
  };

  onBlur = () => {
    if (!this.editable)
      return;

    this.setState({editing: false});
    this.props.cancel();
  };

  onKeyDown = event => {
    if (this.props.alertShowing || !this.editable)
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
               ref="input"
               styleName={inputStyle}
               value={this.state.text}
               readOnly={!editable}
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
