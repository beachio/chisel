import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import JSONView from '../../../elements/JSONView/JSONView';

import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import EditableTitleControl from 'components/elements/EditableTitleControl/EditableTitleControl';
import {getNameId, checkModelName, checkFieldName, getAlertForNameError, modelToJSON, NAME_ERROR_OTHER} from 'utils/data';
import {MODAL_TYPE_FIELD} from 'ducks/nav';
import {ALERT_TYPE_CONFIRM} from 'components/modals/AlertModal/AlertModal';
import {ModelFieldData} from 'models/ModelData';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  state = {
    fields: [],
    fieldName: "",
    jsonVisibility: false
  };
  model = null;
  activeInput = null;
  titleActive = false;
  

  componentWillMount() {
    this.model = this.props.model;
    this.setState({fields: this.props.model.fields});
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing) {
      if (this.titleActive) {
        this.controlTitle.onEditClick();
        this.titleActive = false;
      } else if (this.activeInput) {
        this.activeInput.focus();
      }
    }
    this.setState({fields: nextProps.model.fields});
  }

  onFieldNameChange = event => {
    let name = event.target.value;
    this.setState({fieldName: name});
  };

  onAddKeyDown = event => {
    if (this.props.modalShowing || this.props.alertShowing)
      return;
    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddField();
      //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({fieldName: ""});
    }
  };

  onAddField = event => {
    if (event)
      event.preventDefault();

    if (!this.state.fieldName)
      return;

    let error = checkFieldName(this.state.fieldName);
    if (error) {
      const {showAlert} = this.props;
      showAlert(getAlertForNameError(error));
      return;
    }
  
    let field = new ModelFieldData();
    field.model = this.model;
    field.name = this.state.fieldName;
    field.nameId = getNameId(field.name, this.model.fields);
    this.props.showModal(MODAL_TYPE_FIELD, field);

    this.setState({fieldName: ""});
  };

  onRemoveClick(event, field) {
    event.stopPropagation();
    const {showAlert, deleteField} = this.props;
    let params = {
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting ${field.name} field`,
      description: "Are you sure?",
      onConfirm: () => deleteField(field)
    };
    showAlert(params);
  }

  onFieldClick = field => {
    const {showModal, isEditable} = this.props;
    if (isEditable)
      showModal(MODAL_TYPE_FIELD, field);
  };

  onJSONClick = () => {
    this.setState({
      jsonVisibility: !this.state.jsonVisibility
    });
  };

  updateModelName = (name, callback, silent) => {
    if (name != this.model.name) {
      let error = checkModelName(name);
      if (!error) {
        this.model.name = name;
        this.props.updateModel(this.model);
      } else if (error != NAME_ERROR_OTHER) {
        if (!silent) {
          this.props.showAlert(getAlertForNameError(error));
          this.titleActive = true;
        } else if (callback != undefined) {
          callback(this.model.name);
        }
      }
    }
  };

  updateModelDescription = description => {
    if (description != this.model.description) {
      this.model.description = description;
      this.props.updateModel(this.model);
    }
  };

  render() {
    const {onClose, isEditable, alertShowing} = this.props;

    let content;
    if (this.state.jsonVisibility) {
      content = (
        <JSONView content={modelToJSON(this.model)} />
      )
    } else {
      content = (
        <div styleName="model-wrapper">
          <div styleName="list">
            {
              this.state.fields.map(field => {
                let colorStyle = {background: field.color};
                let key = field.origin && field.origin.id ? field.origin.id : Math.random();
                
                let style = "list-item";
                if (isEditable)
                  style += " list-item_pointer";

                return (
                  <div styleName={style}
                       key={key}
                       onClick={() => this.onFieldClick(field)}>
                    <div styleName="list-item-color" style={colorStyle}></div>
                    <div styleName="list-item-text">
                      <div styleName="list-item-name">{field.name}</div>
                      <div styleName="list-item-type">{field.type} — {field.appearance}</div>
                    </div>
                    {
                      field.isTitle &&
                        <div styleName="title-button">TITLE</div>
                    }
                    {
                      isEditable &&
                        <div styleName="hidden-controls">
                          <div styleName="hidden-remove" onClick={event => this.onRemoveClick(event, field)}>
                            <InlineSVG styleName="cross"
                                       src={require("assets/images/cross.svg")}/>
                          </div>
                        </div>
                    }
                  </div>
                );
              })
            }
          </div>
          {
            isEditable &&
              <div styleName="input-wrapper">
                <InputControl placeholder="Add New Field"
                              value={this.state.fieldName}
                              autoFocus={true}
                              onKeyDown={this.onAddKeyDown}
                              onChange={this.onFieldNameChange}
                              DOMRef={c => this.activeInput = c}
                              icon="plus"
                              onIconClick={this.onAddField} />
              </div>
          }
        </div>
      );
    }

    let titles = (
      <div>
        <EditableTitleControl text={this.model.name}
                              ref={cmp => this.controlTitle = cmp}
                              placeholder={"Model name"}
                              alertShowing={alertShowing}
                              required
                              update={isEditable ? this.updateModelName : null} />
        <EditableTitleControl text={this.model.description}
                              placeholder={"Model description"}
                              isSmall={true}
                              alertShowing={alertShowing}
                              update={isEditable ? this.updateModelDescription : null} />
      </div>
    );

    return (
      <ContainerComponent hasTitle2={true}
                          titles={titles}
                          onClickBack={onClose}
                          onClickRLink={this.onJSONClick}
                          rLinkTitle={this.state.jsonVisibility ? 'Fields' : 'JSON'} >
        {content}
      </ContainerComponent>
    );
  }
}
