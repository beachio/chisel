import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import JSONView from '../../../elements/JSONView/JSONView';

import {ModelFieldData} from 'models/ModelData';
import {checkFieldName} from 'ducks/models';
import {MODAL_TYPE_FIELD} from 'ducks/nav';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  state = {
    fields: [],
    fieldName: "",
    jsonVisibility: false
  };
  activeInput = null;


  componentWillMount() {
    this.setState({fields: this.props.model.fields});
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

  onKeyDown = event => {
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
        description: "This name is already using. Please, select another one.",
        buttonText: "OK"
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

  onFieldClick = field => {
    const {showModal} = this.props;
    showModal(MODAL_TYPE_FIELD, field);
  };

  onJSONClick = () => {
    this.setState({
      jsonVisibility: !this.state.jsonVisibility
    });
  };

  render() {
    const {model, onClose} = this.props;

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
                      <div styleName="hidden-remove">
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
                   onKeyDown={this.onKeyDown}
                   onChange={this.onFieldNameChange}
                   ref={c => this.activeInput = c} />
            <InlineSVG styleName="plus"
                       src={require("./plus.svg")}
                       onClick={this.onAddField} />
          </div>
        </div>
      );
    }

    return (
      <div className="g-container" styleName="models">
        <div styleName="header">
          <div styleName="back" onClick={onClose}>Back</div>
          <div styleName="header-name">{model.name}</div>
          <div styleName="json-fields" onClick={this.onJSONClick}>
            {this.state.jsonVisibility ? 'Fields' : 'JSON'}
          </div>
          <div styleName="header-description">{model.description}</div>
        </div>
        {content}
      </div>
    );
  }
}
