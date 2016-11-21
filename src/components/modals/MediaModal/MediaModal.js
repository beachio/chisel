import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {removeSpaces, filterSpecials} from 'utils/common';
import {checkFieldName, NAME_ERROR_NAME_EXIST, NAME_ERROR_NAME_RESERVED} from 'utils/data';
import {FIELD_TYPES, FIELD_TYPE_SHORT_TEXT} from 'models/ModelData';

import styles from './MediaModal.sss';

@CSSModules(styles, {allowMultiple: true})
export default class MediaModal extends Component {
  state = {
    name: '',
    nameId: '',
    type: '',
    appearance: '',
    isTitle: '',

    error: null,

    appList: []
  };

  typeList = Array.from(FIELD_TYPES.keys());
  field = null;
  onClose = null;


  componentWillMount() {
    this.field = this.props.params;
    this.onClose = this.props.onClose;
    this.setState({
      name:       this.field.name,
      nameId:     this.field.nameId,
      type:       this.field.type,
      appearance: this.field.appearance,
      isTitle:    this.field.isTitle,

      appList:    FIELD_TYPES.get(this.field.type)
    });
  }

  onChangeName = event => {
    let name = event.target.value;
    let nameId = filterSpecials(removeSpaces(name));

    this.setState({name, nameId, error: null});
  };

  onChangeType = type => {
    this.setState({
      type,
      appList: FIELD_TYPES.get(type),
      appearance: FIELD_TYPES.get(type)[0]
    });
  };

  onChangeAppearance = appearance => {
    this.setState({appearance});
  };

  onChangeIsTitle = isTitle => {
    this.setState({isTitle});
  };

  onSave = () => {
    if (!this.state.name) {
      this.onClose();
      return;
    }

    if (this.field.name != this.state.name) {
      let error = checkFieldName(this.state.name);
      if (error) {
        this.setState({error});
        return;
      }
    }

    this.field.name       = this.state.name;
    this.field.nameId     = this.state.nameId;
    this.field.type       = this.state.type;
    this.field.appearance = this.state.appearance;
    this.field.isTitle    = this.state.isTitle;

    this.props.updateField(this.field);
    this.onClose();
  };

  render() {
    let headName = this.state.name.length ? this.state.name : '?';

    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="content">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            label="search media files"
                            placeholder="Lake"
                            onChange={this.onChangeName} />
            </div>

            <div styleName="media">
              <div styleName="media-item media-chosen">
                <div styleName="media-header">
                  lakeside
                </div>
                <div styleName="media-content">
                </div>
              </div>
              <div styleName="media-item">
                <div styleName="media-header">
                  lake
                </div>
                <div styleName="media-content">
                </div>
              </div>
              <div styleName="media-item media-chosen">
                <div styleName="media-header">
                  lakeside
                </div>
                <div styleName="media-content">
                </div>
              </div>
              <div styleName="media-item">
                <div styleName="media-header">
                  lakeside
                </div>
                <div styleName="media-content">
                </div>
              </div>
              <div styleName="media-item">
                <div styleName="media-header">
                  lake
                </div>
                <div styleName="media-content">
                </div>
              </div>
              <div styleName="media-item">
                <div styleName="media-header">
                  lakeside
                </div>
                <div styleName="media-content">
                </div>
              </div>
            </div>

            <div styleName="input-wrapper buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="green"
                               value="Save"
                               onClick={this.onSave} />
              </div>
              <div styleName="buttons-inner">
                <ButtonControl color="gray"
                               value="Cancel"
                               onClick={this.onClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
