import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import InputControl from 'components/elements/InputControl/InputControl';

import styles from './DropdownControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    suggestionValue: '',
    suggestionsVisibility: false,
    disabled: false
  };
  suggestionsList = [];
  onSuggest = null;


  constructor(props) {
    super(props);
    
    const {suggestionsList, suggest, current, disabled} = props;
    this.onSuggest = suggest;
    this.suggestionsList = suggestionsList;

    this.state.disabled = disabled;
  
    if (suggestionsList.indexOf(current) != -1)
      this.state.suggestionValue = current;
  }

  componentWillReceiveProps(nextProps) {
    const {suggestionsList, current, disabled} = nextProps;
    
    this.suggestionsList = suggestionsList;
  
    if (suggestionsList.indexOf(current) != -1)
      this.setState({suggestionValue: current, disabled});
    else
      this.setState({suggestionValue: '', disabled});
  }

  onSuggestionClick = event => {
    const item = event.target.innerText;
    this.setState({
      suggestionValue: item,
      suggestionsVisibility: false
    });
    this.onSuggest(item);
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
    const {label, type} = this.props;

    if (this.state.disabled)
      return <InputControl label={label}
                           icon="lock"
                           value={this.state.suggestionValue}
                           dropdown={true}
                           readOnly={true} />;


    const wrapperClasses = classNames({
      'input-wrapper type-wrapper': type === undefined,
      'input-wrapper type-wrapper dropdown-big': type === 'big'
    });

    const inputClasses = classNames({
      'input': true,
      'input suggestions-visible': this.state.suggestionsVisibility
    });

    const arrowClasses = classNames({
      'arrow-down': true,
      'arrow-down arrow-rotated': this.state.suggestionsVisibility
    });

    const suggestions = this.suggestionsList.map(suggestionsItem => (
      <div onMouseDown={this.onSuggestionClick}
           styleName="suggestion"
           key={suggestionsItem}>
        {suggestionsItem}
      </div>
    ));

    let icon = <InlineSVG styleName={arrowClasses} src={require("assets/images/arrow-down.svg")} />;
    if (type === 'big')
      icon = <InlineSVG styleName="arrows" src={require("assets/images/arrows.svg")} />;

    let labelEl;
    if (label)
      labelEl = (<div styleName="label">{label}</div>);

    return (
      <div styleName={wrapperClasses} onBlur={this.onSuggestionBlur}>
        {labelEl}
        <div styleName="input-wrapper">
          {icon}
          <input styleName={inputClasses}
                 value={this.state.suggestionValue}
                 onClick={this.onSuggestionInputClick}
                 readOnly />
          <div styleName="suggestions">
            {suggestions}
          </div>
        </div>
      </div>
    );
  }
}
