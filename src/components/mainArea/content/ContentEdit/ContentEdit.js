import React, {Component, PropTypes} from 'react';
import {Parse} from 'parse';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import _ from 'lodash/core';
import 'flatpickr/dist/flatpickr.material_green.min.css';
import Flatpickr from 'react-flatpickr';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

import InputControl from '../../../elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {FIELD_TYPE_SHORT_TEXT, FIELD_TYPE_LONG_TEXT, FIELD_TYPE_REFERENCE, FIELD_TYPE_REFERENCES,
  FIELD_TYPE_IMAGE, FIELD_TYPE_INTEGER, FIELD_TYPE_FLOAT, FIELD_TYPE_DATE, FIELD_TYPE_BOOLEAN, FIELD_TYPE_JSON} from 'models/ModelData';

import styles from './ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentEdit extends Component {
  state = {
    title: "",
    slug: "",
    color: "rgba(0, 0, 0, 1)",
    fields: new Map(),

    editTitle: false,
    titleInputWidth: 0
  };
  item = null;

  componentWillMount() {
    this.item = this.props.item;
    this.setState({
      title:  this.item.title,
      slug:   this.item.slug,
      color:  this.item.color,
      fields: this.item.fields
    });
  }

  onEditClickTitle = () => {
    this.setState({editTitle: true});
    this.refs.name.focus();
  };

  onTitleChange = event => {
    let title = event.target.value;
    this.setState({
      title,
      nameInputWidth: event.target.value.length
    });
  };

  onSlugChange = event => {
    let slug = event.target.value;
    this.setState({slug});
  };

  onTitleBlur = () => {
    this.endEdit();
  };

  onTitleKeyDown = event => {
    //Enter pressed
    if (event.keyCode == 13) {
      this.onSave();
      this.endEdit();
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.endEdit();
    }
  };

  endEdit() {
    this.setState({editTitle: false});
  }

  onClose = () => {
    this.onSave();
    this.props.onClose();
  };

  onSave() {
    if (!this.state.title)
      return;

    this.item.title = this.state.title;
    this.item.slug  = this.state.slug;
    this.item.color = this.state.color;
    this.item.fields = this.state.fields;

    this.props.updateItem(this.item);
  }

  onChange_SHORT_TEXT(event, field) {
    let value = event.target.value;
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_LONG_TEXT(event, field) {
    let value = event.target.value;
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_FLOAT(event, field) {
    let str = event.target.value;
    let value = parseFloat(str);
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_INTEGER(event, field) {
    let str = event.target.value;
    let value = parseInt(str);
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_BOOLEAN(value, field) {
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_IMAGE(event, field) {
    let file = event.target.files[0];
    let parseFile = new Parse.File(field.nameId, file);
    parseFile.save().then(() => {
      this.setState({fields: this.state.fields.set(field, parseFile)});
    });
  }
  
  onChange_DATE(dateStr, field) {
    if (dateStr) {
      let date = new Date(dateStr);
      let oldDate = this.state.fields.get(field);
      date.setHours(oldDate.getHours());
      date.setMinutes(oldDate.getMinutes());
      this.setState({fields: this.state.fields.set(field, date)});
    }
  }
  
  onChange_TIME(time, field) {
    let date = this.state.fields.get(field);
    date.setHours(time.hour());
    date.setMinutes(time.minute());
    this.setState({fields: this.state.fields.set(field, date)});
  }

  generateElement(field, value) {
    let inner;

    switch (field.type) {
      case FIELD_TYPE_SHORT_TEXT:
        if (!value)
          value = "";
        inner = (
          <div styleName="input-wrapper">
            <input styleName="input"
                   ref={field.nameId}
                   value={value}
                   onChange={e => this.onChange_SHORT_TEXT(e, field)} />
          </div>
        );
        break;

      case FIELD_TYPE_LONG_TEXT:
        if (!value)
          value = "";
        inner = (
          <textarea styleName="textarea"
                    ref={field.nameId}
                    value={value}
                    onChange={e => this.onChange_LONG_TEXT(e, field)} />
        );
        break;

      case FIELD_TYPE_FLOAT:
        if (!value)
          value = 0;
        inner = (
          <div styleName="input-wrapper">
            <input styleName="input"
                   ref={field.nameId}
                   value={value}
                   onChange={e => this.onChange_FLOAT(e, field)} />
          </div>
        );
        break;

      case FIELD_TYPE_INTEGER:
        if (!value)
          value = 0;
        inner = (
          <div styleName="input-wrapper">
            <input styleName="input"
                   ref={field.nameId}
                   value={value}
                   onChange={e => this.onChange_INTEGER(e, field)} />
          </div>
        );
        break;

      case FIELD_TYPE_BOOLEAN:
        if (!value)
          value = false;
        let id1 = _.uniqueId('radio1_');
        let id2 = _.uniqueId('radio2_');
        inner = (
          <div styleName="radio-wrapper">
            <div styleName="radio-button">
              <input styleName="radio"
                     type="radio"
                     id={id1}
                     name="radio"
                     checked={value}
                     onChange={e => this.onChange_BOOLEAN(true, field)} />
              <label styleName="radio-label" htmlFor={id1}>Yes</label>
            </div>
            <div styleName="radio-button">
              <input styleName="radio"
                     type="radio"
                     id={id2}
                     name="radio"
                     checked={!value}
                     onChange={e => this.onChange_BOOLEAN(false, field)} />
              <label styleName="radio-label" htmlFor={id2}>No</label>
            </div>
          </div>
        );
        break;

      case FIELD_TYPE_IMAGE:
        let imgStyle = {};
        if (value)
          imgStyle = {backgroundImage: `url(${value.url()})`};

        inner = (
          <div styleName="image" style={imgStyle}>
            <div styleName="fileUpload">
              <input styleName="fileUpload-input"
                     type="file"
                     onChange={e => this.onChange_IMAGE(e, field)} />
            </div>
          </div>
        );
        break;
  
      case FIELD_TYPE_DATE:
        let time = moment();
        if (value) {
          time.hour(value.getHours());
          time.minute(value.getMinutes());
        }
        inner = (
          <div styleName="input-wrapper">
            <Flatpickr value={value}
                       data-alt-input="true"
                       data-alt-format="F j, Y"
                       onChange={(obj, str, ins) => this.onChange_DATE(str, field)} />
            <TimePicker showSecond={false}
                        value={time}
                        onChange={e => this.onChange_TIME(e, field)} />
          </div>
        );
        break;
    }

    return (
      <div styleName="field" key={field.nameId}>
        <div styleName="field-title">
          {field.name}
        </div>
        {inner}
      </div>
    );
  }

  generateContent() {
    let content = [];
    for (let [field, value] of this.state.fields) {
      let elm = this.generateElement(field, value);
      content.push(elm);
    }
    return (
      <div>
        {content}
      </div>
    );
  }

  render() {
    const {isEditable} = this.props;

    let titleStyle = "header-title";
    if (this.state.editTitle)
      titleStyle += " header-title-edit";

    let content = this.generateContent();

    return (
      <div className="g-container" styleName="ContentEdit">

        <div styleName="header">
          <div styleName="back" onClick={this.onClose}>Back</div>
          <div styleName="header-wrapper">
            <input size={this.state.nameInputWidth}
                   ref="name"
                   styleName={titleStyle}
                   value={this.state.title}
                   readOnly={!this.state.editTitle}
                   placeholder="Type title"
                   onBlur={this.onTitleBlur}
                   onChange={this.onTitleChange}
                   onKeyDown={this.onTitleKeyDown} />
            <div styleName="edit"
                 onClick={this.onEditClickTitle} >
              edit
            </div>
          </div>
          <div styleName="header-wrapper">
            <div styleName="header-model">
              {this.item.model.name}
            </div>
          </div>
        </div>
        <div styleName="content">
          <div styleName="field">
            <InputControl label="slug"
                          type="big"
                          placeholder="Type slug"
                          readOnly={!isEditable}
                          value={this.state.slug}
                          onChange={this.onSlugChange} />
          </div>
          {content}
        </div>
      </div>
    );
  }
}
