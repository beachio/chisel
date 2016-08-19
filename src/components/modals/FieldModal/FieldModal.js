import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {removeSpacesFromString, filterString} from 'models/ModelData';
import {checkFieldName} from 'ducks/models';

import styles from './FieldModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class FieldModal extends Component {
  state = {
    name: '',
    nameId: '',

    suggestionPlaceholder: 'Short Text',
    suggestionValue: '',
    suggestionsVisibility: false
  };
  field = null;
  onClose = null;


  componentWillMount() {
    this.field = this.props.params;
    this.onClose = this.props.onClose;
    this.setState({
      name:   this.field.name,
      nameId: this.field.nameId
    });
  }

  onChangeName = event => {
    let name = event.target.value;
    let nameId = filterString(removeSpacesFromString(name));

    this.setState({name, nameId});
  };

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

  onSuggestionInputChange = event => {
    this.setState({
      suggestionValue: event.target.value
    });
  };

  onSuggestionBlur = () => {
    this.setState({
      suggestionsVisibility: false
    });
  };

  onSave = () => {
    if (!this.state.name) {
      this.onClose();
      return;
    }
    
    if (this.field.name != this.state.name && !checkFieldName(this.state.name)) {
      const {showAlert} = this.props;
      let params = {
        title: "Warning",
        description: "This name is already using. Please, select another one.",
        buttonText: "OK"
      };
      showAlert(params);
      return;
    }
    
    this.field.name = this.state.name;
    this.field.nameId = this.state.nameId;
  
    const {updateField} = this.props;
    updateField(this.field);
    this.onClose();
  };

  render() {
    let inputClasses = classNames({
      'input': true,
      'input suggestions-visible': this.state.suggestionsVisibility
    });

    let arrowClasses = classNames({
      'arrow-down': true,
      'arrow-down arrow-rotated': this.state.suggestionsVisibility
    });

    const field = this.props.params;

    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">{field.name}</div>
            <div styleName="subtitle">{field.type}</div>
          </div>
          <div styleName="content">
            <form>
              <div styleName="input-wrapper">
                <div styleName="label">Name</div>
                <input styleName="input"
                       onChange={this.onChangeName}
                       value={this.state.name} />
              </div>
              <div styleName="input-wrapper">
                <div styleName="label">Field ID</div>
                <InlineSVG styleName="lock" src={require("./lock.svg")} />
                <input styleName="input input-readonly"
                       placeholder="mainTitle"
                       value={this.state.nameId}
                       readOnly />
              </div>
              <div styleName="input-wrapper type-wrapper" onBlur={this.onSuggestionBlur}>
                <div styleName="label">Type</div>
                <InlineSVG styleName={arrowClasses} src={require("./arrow-down.svg")} />
                <input styleName={inputClasses}
                       placeholder={this.state.suggestionPlaceholder}
                       value={this.state.suggestionValue}
                       onClick={this.onSuggestionInputClick}
                       onChange={this.onSuggestionInputChange} />
                <div styleName="suggestions">
                  <div onMouseEnter={this.onSuggestionHover}
                       onMouseDown={this.onSuggestionClick}
                       styleName="suggestion">
                    Title
                  </div>
                  <div onMouseEnter={this.onSuggestionHover}
                       onMouseDown={this.onSuggestionClick}
                       styleName="suggestion">
                    Long text
                  </div>
                  <div onMouseEnter={this.onSuggestionHover}
                       onMouseDown={this.onSuggestionClick}
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
                  <ButtonControl type="green"
                                 value="Save"
                                 onClick={this.onSave} />
                </div>
                <div styleName="buttons-inner">
                  <ButtonControl type="gray"
                                 value="Cancel"
                                 onClick={this.onClose} />
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}
