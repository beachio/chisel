import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './FieldModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class FieldModal extends Component  {
  state = {
    valueInput: '',
    suggestionPlaceholder: 'Short Text',
    suggestionValue: '',
    suggestionsVisibility: false
  };

  onChangeValue = event => {
    this.setState({
      valueInput: event.target.value
    });
  };

  onSuggestionHover = event => {
    this.setState({
      suggestionPlaceholder: event.target.innerHTML
    })
  }

  onSuggestionClick = event => {
    this.setState({
      suggestionValue: event.target.innerHTML,
      suggestionsVisibility: false
    })
  }

  onInputClick = (event) => {
    this.setState({
      suggestionsVisibility: true,
      suggestionValue: event.target.value
    })
  }

  onInputBlur = () => {
    this.setState({
      suggestionsVisibility: false
    })
  }

  render() {
    let camelize = str => {
      return str.replace(/\W+(.)/g, (match, chr) => {
        return chr.toUpperCase();
      });
    };

    let inputClasses = classNames({
      'input': true,
      'input suggestions-visible': this.state.suggestionsVisibility === true
    });

    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">Title</div>
            <div styleName="subtitle">Short Text</div>
          </div>
          <div styleName="content">

            <form>
              <div styleName="input-wrapper">
                <div styleName="label">Name</div>
                <input styleName="input"
                       placeholder="Main Title"
                       onChange={this.onChangeValue}
                       value={this.state.valueInput} />
              </div>
              <div styleName="input-wrapper">
                <div styleName="label">Field ID</div>
                <input styleName="input input-readonly"
                       placeholder="mainTitle"
                       value={camelize(this.state.valueInput)}
                       readOnly />
              </div>
              <div styleName="input-wrapper type-wrapper">
                <div styleName="label">Type</div>
                <input styleName={inputClasses}
                       placeholder={this.state.suggestionPlaceholder}
                       value={this.state.suggestionValue}
                       onClick={(event) => this.onInputClick(event)} />
                <div styleName="suggestions" >
                  <div onMouseEnter={(event) => this.onSuggestionHover(event)}
                       onClick={(event) => this.onSuggestionClick(event)}
                       styleName="suggestion">
                    Title
                  </div>
                  <div onMouseEnter={(event) => this.onSuggestionHover(event)}
                       onClick={(event) => this.onSuggestionClick(event)}
                       styleName="suggestion">
                    Long text
                  </div>
                  <div onMouseEnter={(event) => this.onSuggestionHover(event)}
                       onClick={(event) => this.onSuggestionClick(event)}
                       styleName="suggestion">
                    Short text
                  </div>
                </div>
              </div>

              <div styleName="input-wrapper">
                <div styleName="label">Entry Title</div>
                <div styleName="switch">
                  <SwitchControl />
                </div>
              </div>

              <div styleName="input-wrapper buttons-wrapper">
                <div styleName="buttons-inner">
                  <ButtonControl type="green" value="Save" />
                </div>
                <div styleName="buttons-inner">
                  <ButtonControl type="gray" value="Cancel" />
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}
