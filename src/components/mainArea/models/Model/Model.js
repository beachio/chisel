import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {ModelFieldData} from 'models/ModelData';
import {MODAL_TYPE_FIELD} from 'ducks/nav';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  state = {
    fields: [],
    fieldName: ""
  };

  componentDidMount() {
    this.setState({fields: this.props.model.fields});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({fields: nextProps.model.fields});
  }

  onFieldNameChange = event => {
    let name = event.target.value;
    name = name.replace(/\s+/g, '');
    this.setState({fieldName: name});
  };

  onAddField = event => {
    if (event)
      event.preventDefault();

    if (!this.state.fieldName)
      return;

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

  render() {
    const {model, onClose} = this.props;

    return (
      <div className="g-container" styleName="models">
        <div styleName="header">
          <div styleName="back" onClick={onClose}>Back</div>
          <div styleName="header-name">{model.name}</div>
          <div styleName="header-description">{model.description}</div>
        </div>
        <div styleName="list">
          {
            this.state.fields.map(field => {
              let colorStyle = {background: field.color};
              let key = model.origin && model.origin.id ? model.origin.id : Math.random();

              return (
                <div styleName="list-item" key={key}>
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

        <form styleName="create-new" onSubmit={this.onAddField}>
          <input styleName="input"
                 placeholder="Add New Field"
                 value={this.state.fieldName}
                 autoFocus={true}
                 onChange={this.onFieldNameChange} />
          <InlineSVG styleName="plus"
                     src={require("./plus.svg")}
                     onClick={this.onAddField} />
        </form>
      </div>
    );
  }
}
