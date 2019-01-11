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
    if (suggestionsList)
      this.suggestionsList = suggestionsList;

    this.state.disabled = disabled;

    if (this.suggestionsList.indexOf(current) != -1 || current === undefined)
      this.state.suggestionValue = current;
  }

  componentWillReceiveProps(nextProps) {
    const {suggestionsList, current, disabled} = nextProps;

    this.suggestionsList = suggestionsList;

    if (suggestionsList.indexOf(current) != -1 || current === undefined)
      this.setState({suggestionValue: current, disabled});
    else
      this.setState({suggestionValue: '', disabled});
  }

  onSuggestionClick = item => {
    this.setState({
      suggestionValue: item,
      suggestionsVisibility: false
    });
    this.onSuggest(item);
  };

  onSuggestionInputClick = () => {
    this.setState({
      suggestionsVisibility: !this.state.suggestionsVisibility
    });
  };

  onSuggestionBlur = () => {
    this.setState({
      suggestionsVisibility: false
    });
  };

  render() {
    const {label, type, titled} = this.props;

    let value = this.state.suggestionValue;
    if (value == '')
      value = '(empty)';
    else if (!value)
      value = '(undefined)';

    if (this.state.disabled)
      return <InputControl label={label}
                           icon="lock"
                           value={value}
                           titled={titled}
                           dropdown={true}
                           readOnly={true} />;

    const wrapperClasses = classNames({
      'input-wrapper type-wrapper': true,
      'dropdown-big': type === 'big'
    });

    const inputClasses = classNames({
      'input': true,
      'suggestions-visible': this.state.suggestionsVisibility,
      'empty': !this.state.suggestionValue,
      'input-titled': titled
    });

    const arrowClasses = classNames({
      'arrow-down': true,
      'arrow-rotated': this.state.suggestionsVisibility
    });

    const suggestions = this.suggestionsList.map(suggestionsItem => {
      const key = this.suggestionsList.indexOf(suggestionsItem);
      const styleName = classNames({
        'suggestion': true,
        'empty': !suggestionsItem
      });
      return (
        <div onMouseDown={() => this.onSuggestionClick(suggestionsItem)}
             styleName={styleName}
             key={key}>
          {suggestionsItem ? suggestionsItem : '(empty)'}
        </div>
      );
    });

    let icon = <InlineSVG styleName={arrowClasses} src={require("assets/images/icon-triangular-arrow.svg")} />;
    if (type === 'big')
      icon = <InlineSVG styleName="arrows" src={require("assets/images/arrows.svg")} />;

    return (
      <div styleName={wrapperClasses} onBlur={this.onSuggestionBlur}>
        {label &&
          <div styleName="label">{label}</div>
        }
        <div styleName="input-wrapper">
          {icon}
          <input styleName={inputClasses}
                 value={value}
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
