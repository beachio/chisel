import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './EditableTitleControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class EditableTitleControl extends Component {
  state = {
    text: '',
    editing: false,
    width: 0
  };
  
  componentWillMount() {
    this.setState({text: this.props.text});
  }
  
  componentDidMount() {
    this.setState({width: this.refs.input.value.length});
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({text: nextProps.text});
  }
  
  onEditClick = () => {
    this.setState({editing: true});
    this.refs.input.focus();
  };
  
  onChange = event => {
    let text = event.target.value;
    this.setState({
      text,
      width: event.target.value.length
    });
  };
  
  onBlur = () => {
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
  
    let style = "input";
    if (this.state.editing)
      style += " input-editing";
    if (isSmall)
      style += " input-small";
    
    return (
      <div styleName="wrapper">
        <input size={this.state.width}
               ref="input"
               styleName={style}
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