import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import styles from './DropdownControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    suggestionPlaceholder: 'Short Text',
    suggestionValue: '',
    suggestionsVisibility: false
  }

  onSuggestionHover = event => {
    this.setState({
      suggestionPlaceholder: event.target.innerHTML
    });
  };

  onSuggestionClick = event => {
    this.setState({
      suggestionValue: event.target.innerHTML,
      suggestionsVisibility: false
    });
  };

  onSuggestionInputClick = event => {
    this.setState({
      suggestionsVisibility: true,
      suggestionValue: event.target.value
    });
  };

  onSuggestionBlur = () => {
    this.setState({
      suggestionsVisibility: false
    });
  };

  render() {
    const { label, suggestionsList } = this.props;

    let inputClasses = classNames({
      'input': true,
      'input suggestions-visible': this.state.suggestionsVisibility
    });

    let arrowClasses = classNames({
      'arrow-down': true,
      'arrow-down arrow-rotated': this.state.suggestionsVisibility
    });

    let suggestions = suggestionsList.map((suggestionsItem) => {
      return (
        <div onMouseEnter={this.onSuggestionHover}
             onMouseDown={this.onSuggestionClick}
             styleName="suggestion">
          {suggestionsItem}
        </div>
      )
    });

    return (
      <div styleName="input-wrapper type-wrapper" onBlur={this.onSuggestionBlur}>
        <div styleName="label">{label}</div>
        <InlineSVG styleName={arrowClasses} src={require("./arrow-down.svg")} />
        <input styleName={inputClasses}
               placeholder={this.state.suggestionPlaceholder}
               value={this.state.suggestionValue}
               onClick={this.onSuggestionInputClick}
               readOnly />
        <div styleName="suggestions">

          {suggestions}

        </div>
      </div>
    );
  }
}
