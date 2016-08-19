import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
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
    const field = this.props.params;

    let suggestionsList = [ 'Title', 'Short Text', 'Long Text', 'Something else', 'Хутин пуй', 'Газманов', 'Temihren'];

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

             <DropdownControl label="Type" suggestionsList={suggestionsList} />

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
