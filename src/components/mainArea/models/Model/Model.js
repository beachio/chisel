import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import JSONView from '../../../elements/JSONView/JSONView';
import FlipMove from 'react-flip-move';

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
  returnFocus = false;
  titleActive = false;
  

  constructor(props) {
    super(props);
    
    this.model = props.model;
    this.state.fields = props.model.fields;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && !nextProps.modalShowing) {
      if (this.titleActive) {
        this.titleActive = false;
        this.controlTitle.onEditClick();
        
      } else if (this.activeInput && this.returnFocus) {
        this.returnFocus = false;
        setTimeout(() => this.activeInput.focus(), 1);
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
  
    this.returnFocus = true;
    
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
  
    this.returnFocus = true;
    
    this.props.showAlert({
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting ${field.name} field`,
      description: "Are you sure?",
      onConfirm: () => this.props.deleteField(field)
    });
  }

  onFieldClick = field => {
    if (!this.props.isEditable)
      return;
  
    this.returnFocus = true;
    this.props.showModal(MODAL_TYPE_FIELD, field);
  };

  onJSONClick = () => {
    this.setState({
      jsonVisibility: !this.state.jsonVisibility
    });
  };

  updateModelName = (name, callback, silent) => {
    if (name == this.model.name)
      return;
      
    let error = checkModelName(name);
    if (!error) {
      this.model.name = name;
      this.props.updateModel(this.model);
      
    } else if (error != NAME_ERROR_OTHER) {
      if (!silent) {
        this.returnFocus = true;
        this.props.showAlert(getAlertForNameError(error));
        this.titleActive = true;
      } else if (callback != undefined) {
        callback(this.model.name);
      }
    }
  };

  updateModelDescription = description => {
    if (description == this.model.description)
      return;
  
    this.model.description = description;
    this.props.updateModel(this.model);
  };

  render() {
    const {onClose, isEditable, alertShowing} = this.props;

    let content;
    if (this.state.jsonVisibility) {
      let json = modelToJSON(this.model);
      content = <JSONView content={json} />;
      
    } else {
      content = (
        <div styleName="model-wrapper">
          <div styleName="list">
            <FlipMove duration={500}
                      enterAnimation="fade"
                      leaveAnimation="fade"
                      maintainContainerHeight
                      easing="ease-out">
              {this.state.fields.map(field => {
                let colorStyle = {background: field.color};
                
                let style = "list-item";
                if (isEditable)
                  style += " list-item_pointer";
  
                return (
                  <div styleName={style}
                       key={field.name}
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
              })}
              {isEditable &&
                <div styleName="input-wrapper">
                  <InputControl placeholder="Add New Field"
                                value={this.state.fieldName}
                                onKeyDown={this.onAddKeyDown}
                                onChange={this.onFieldNameChange}
                                DOMRef={c => this.activeInput = c}
                                icon="plus"
                                autoFocus
                                onIconClick={this.onAddField} />
                </div>
              }
            </FlipMove>
          </div>
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
