import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import styles from './DropdownControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    suggestionValue: '',
    suggestionsVisibility: false
  };
  suggestionsList = [];
  suggest = null;
  
  componentWillMount() {
    const {suggestionsList, suggest, current} = this.props;
    this.suggest = suggest;
    this.suggestionsList = suggestionsList;
    this.setState({suggestionValue: current});
  }

  onSuggestionClick = event => {
    let item = event.target.innerHTML;
    this.setState({
      suggestionValue: item,
      suggestionsVisibility: false
    });
    this.suggest(item);
  };

  onSuggestionInputClick = event => {
    this.setState({
      suggestionsVisibility: !this.state.suggestionsVisibility,
      suggestionValue: event.target.value
    });
  };

  onSuggestionBlur = () => {
    this.setState({
      suggestionsVisibility: false
    });
  };

  render() {
    const {label} = this.props;

    let inputClasses = classNames({
      'input': true,
      'input suggestions-visible': this.state.suggestionsVisibility
    });

    let arrowClasses = classNames({
      'arrow-down': true,
      'arrow-down arrow-rotated': this.state.suggestionsVisibility
    });

    let Suggestions = this.suggestionsList.map(suggestionsItem => {
      return (
        <div onMouseDown={this.onSuggestionClick}
             styleName="suggestion"
             key={suggestionsItem}>
          {suggestionsItem}
        </div>
      )
    });

    return (
      <div styleName="input-wrapper type-wrapper" onBlur={this.onSuggestionBlur}>
        <div styleName="label">{label}</div>
        <InlineSVG styleName={arrowClasses} src={require("./arrow-down.svg")} />
        <input styleName={inputClasses}
               value={this.state.suggestionValue}
               onClick={this.onSuggestionInputClick}
               readOnly />
        <div styleName="suggestions">
          {Suggestions}
        </div>
      </div>
    );
  }
}
