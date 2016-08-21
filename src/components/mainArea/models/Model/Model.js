import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import JSONView from '../../../elements/JSONView/JSONView';

import {ModelFieldData} from 'models/ModelData';
import {checkModelName, checkFieldName} from 'utils/data';
import {MODAL_TYPE_FIELD} from 'ducks/nav';
import {ALERT_TYPE_CONFIRM} from 'components/modals/AlertModal/AlertModal';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  state = {
    fields: [],
    fieldName: "",
    jsonVisibility: false,
  
    name: "",
    editName: false,
    description: "",
    editDescription: false
  };
  
  model = null;
  activeInput = null;


  componentWillMount() {
    this.model = this.props.model;
    this.setState({
      name: this.model.name,
      description: this.model.description,
      fields: this.props.model.fields
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.activeInput)
      this.activeInput.focus();
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

    if (!checkFieldName(this.state.fieldName)) {
      const {showAlert} = this.props;
      let params = {
        title: "Warning",
        description: "This name is already using. Please, select another one."
      };
      showAlert(params);
      return;
    }

    const {addField} = this.props;

    let field = new ModelFieldData();
    field.name = this.state.fieldName;

    let red   = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue  = Math.floor(Math.random() * 256);
    field.color = `rgba(${red}, ${green}, ${blue}, 1)`;

    addField(field);

    this.setState({fieldName: ""});
  };
  
  onRemoveClick(event, field) {
    event.stopPropagation();
    const {showAlert, removeField} = this.props;
    let params = {
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting ${field.name} field`,
      description: "Are you sure?",
      onConfirm: () => removeField(field)
    };
    showAlert(params);
  }
  
  onFieldClick = field => {
    const {showModal} = this.props;
    showModal(MODAL_TYPE_FIELD, field);
  };

  onJSONClick = () => {
    this.setState({
      jsonVisibility: !this.state.jsonVisibility
    });
  };
  
  onDoubleClickName = () => {
    this.setState({editName: true});
  };
  
  onNameChange = event => {
    let name = event.target.value;
    this.setState({name});
  };
  
  onNameBlur = () => {
    this.updateModel(true);
  };
  
  onNameKeyDown = event => {
    if (this.props.alertShowing)
      return;
    
    //Enter pressed
    if (event.keyCode == 13) {
      this.updateModel();
      //Esc pressed
    } else if (event.keyCode == 27) {
      this.endEdit();
    }
  };
  
  onDoubleClickDescription = () => {
    this.setState({editDescription: true});
  };
  
  onDescriptionChange = event => {
    let description = event.target.value;
    this.setState({description});
  };
  
  onDescriptionBlur = () => {
    this.updateModel(true);
  };
  
  onDescriptionKeyDown = event => {
    if (this.props.alertShowing)
      return;
    
    //Enter pressed
    if (event.keyCode == 13) {
      this.updateModel();
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.endEdit();
    }
  };
  
  updateModel(endOnSameName) {
    if ((this.state.editName && this.state.name != this.model.name) ||
        (this.state.editDescription && this.state.description != this.model.description)) {
      if (this.state.editName) {
        if (checkModelName(this.state.name)) {
          this.model.name = this.state.name;
          this.props.updateModel(this.model);
          this.endEdit();
        } else {
          if (endOnSameName && !this.props.alertShowing) {
            this.endEdit();
          } else {
            const {showAlert} = this.props;
            let params = {
              title: "Warning",
              description: "This name is already using. Please, select another one."
            };
            showAlert(params);
          }
        }
      } else {
        this.model.description = this.state.description;
        this.props.updateModel(this.model);
        this.endEdit();
      }
    } else {
      this.endEdit();
    }
  }
  
  endEdit() {
    this.activeInput = null;
    this.setState({
      name: this.model.name,
      description: this.model.description,
      editName: false,
      editDescription: false
    });
  }

  render() {
    const {onClose} = this.props;

    let content;
    if (this.state.jsonVisibility) {
      content = (
        <JSONView />
      )
    } else {
      content = (
        <div>
          <div styleName="list">
            {
              this.state.fields.map(field => {
                let colorStyle = {background: field.color};
                let key = field.origin && field.origin.id ? field.origin.id : Math.random();

                return (
                  <div styleName="list-item"
                       key={key}
                       onClick={() => this.onFieldClick(field)}>
                    <div styleName="list-item-color" style={colorStyle}></div>
                    <div styleName="list-item-text">
                      <div styleName="list-item-name">{field.name}</div>
                      <div styleName="list-item-type">{field.type}</div>
                    </div>
                    <div styleName="hidden-controls">
                      <div styleName="hidden-button">TITLE</div>
                      <div styleName="hidden-remove" onClick={event => this.onRemoveClick(event, field)}>
                        <InlineSVG styleName="cross"
                                   src={require("./cross.svg")} />
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>

          <div styleName="create-new">
            <input styleName="input"
                   placeholder="Add New Field"
                   value={this.state.fieldName}
                   autoFocus={true}
                   onKeyDown={this.onAddKeyDown}
                   onChange={this.onFieldNameChange}
                   ref={c => this.activeInput = c} />
            <InlineSVG styleName="plus"
                       src={require("./plus.svg")}
                       onClick={this.onAddField} />
          </div>
        </div>
      );
    }
    
    let nameStyle = "header-name";
    if (this.state.editName)
      nameStyle += " header-name-edit";
    let descriptionStyle = "header-description";
    if (this.state.editDescription)
      descriptionStyle += " header-description-edit";

    return (
      <div className="g-container" styleName="models">
        <div styleName="header">
          <div styleName="back" onClick={onClose}>Back</div>
          <input styleName={nameStyle}
                 value={this.state.name}
                 readOnly={!this.state.editName}
                 placeholder="Type model name"
                 onBlur={this.onNameBlur}
                 onChange={this.onNameChange}
                 onKeyDown={this.onNameKeyDown}
                 onDoubleClick={this.onDoubleClickName} />
          <div styleName="json-fields" onClick={this.onJSONClick}>
            {this.state.jsonVisibility ? 'Fields' : 'JSON'}
          </div>
          <input styleName={descriptionStyle}
                 value={this.state.description}
                 readOnly={!this.state.editDescription}
                 placeholder="Type model description"
                 onBlur={this.onDescriptionBlur}
                 onChange={this.onDescriptionChange}
                 onKeyDown={this.onDescriptionKeyDown}
                 onDoubleClick={this.onDoubleClickDescription} />
        </div>
        {content}
      </div>
    );
  }
}
