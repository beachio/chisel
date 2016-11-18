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

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import EditableTitleControl from 'components/elements/EditableTitleControl/EditableTitleControl';
import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';

import * as ftps from 'models/ModelData';

import styles from './ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentEdit extends Component {
  state = {
    title: "",
    color: "rgba(0, 0, 0, 1)",
    fields: new Map()
  };
  item = null;
  fieldsErrors = new Map();

  componentWillMount() {
    this.item = this.props.item;
    this.setState({
      title:  this.item.title,
      color:  this.item.color,
      fields: new Map(this.item.fields)
    });
  }

  updateItemTitle = title => {
    this.setState({title});
  };

  endEdit() {
  }

  onClose = () => {
    this.onSave();
    this.props.onClose();
  };

  onSave() {
    if (!this.state.title)
      return;

    this.item.title = this.state.title;
    this.item.color = this.state.color;
    this.item.fields = this.state.fields;

    this.props.updateItem(this.item);
  }

  onDiscard = () => {
    this.setState({fields: new Map(this.item.fields)});
  };

  onPublish = () => {
    if (!this.validate()) {
      this.forceUpdate();
      return;
    }

    this.item.published = true;
    this.onClose();
  };

  validate() {
    let total = 0;

    for (let [field, value] of this.state.fields) {
      let error = null;

      switch (field.type) {
        case ftps.FIELD_TYPE_SHORT_TEXT:
          switch (field.appearance) {
            case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
              if (!value && field.isTitle)
                error = "Title must be!";
              break;

            case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
              break;

            case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
              break;
          }
          break;

        case ftps.FIELD_TYPE_LONG_TEXT:
          switch (field.appearance) {
            case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
              break;

            case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
              break;

            case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
              break;
          }
          break;

        case ftps.FIELD_TYPE_FLOAT:
          switch (field.appearance) {
            case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
              break;
          }
          break;

        case ftps.FIELD_TYPE_INTEGER:
          switch (field.appearance) {
            case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
              break;

            case ftps.FIELD_APPEARANCE__INTEGER__RATING:
              break;
          }
          break;

        case ftps.FIELD_TYPE_BOOLEAN:
          switch (field.appearance) {
            case ftps.FIELD_APPEARANCE__BOOLEAN__RADIO:
              break;

            case ftps.FIELD_APPEARANCE__BOOLEAN__SWITCH:
              break;
          }
          break;

        case ftps.FIELD_TYPE_IMAGE:
          switch (field.appearance) {
            case ftps.FIELD_APPEARANCE__MEDIA__MEDIA:
              break;
          }
          break;

        case ftps.FIELD_TYPE_DATE:
          switch (field.appearance) {
            case ftps.FIELD_APPEARANCE__DATE__DATE:
              break;
          }
          break;
      }

      this.fieldsErrors.set(field, error);
      if (error)
        total++;
    }

    return !total;
  };

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
      case ftps.FIELD_TYPE_SHORT_TEXT:
        if (!value)
          value = "";

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SINGLE:
            inner = (
              <div styleName="input-wrapper">
                <input styleName="input"
                       ref={field.nameId}
                       value={value}
                       onChange={e => this.onChange_SHORT_TEXT(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            inner = (
              <div styleName="input-wrapper">
                <input styleName="input"
                       ref={field.nameId}
                       value={value}
                       onChange={e => this.onChange_SHORT_TEXT(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
            inner = (
              <div styleName="input-wrapper">
                <input styleName="input"
                       ref={field.nameId}
                       value={value}
                       onChange={e => this.onChange_SHORT_TEXT(e, field)} />
              </div>
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_LONG_TEXT:
        if (!value)
          value = "";

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__LONG_TEXT__SINGLE:
            inner = (
              <div styleName="input-wrapper">
                <input styleName="input"
                       ref={field.nameId}
                       value={value}
                       onChange={e => this.onChange_LONG_TEXT(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            inner = (
              <textarea styleName="textarea"
                        ref={field.nameId}
                        value={value}
                        onChange={e => this.onChange_LONG_TEXT(e, field)} />
            );
            break;

          case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
            inner = (
              <textarea styleName="textarea"
                        ref={field.nameId}
                        value={value}
                        onChange={e => this.onChange_LONG_TEXT(e, field)} />
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_FLOAT:
        if (!value)
          value = 0;

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__FLOAT__DECIMAL:
            inner = (
              <div styleName="input-wrapper">
                <input styleName="input"
                       ref={field.nameId}
                       value={value}
                       onChange={e => this.onChange_FLOAT(e, field)} />
              </div>
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_INTEGER:
        if (!value)
          value = 0;

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__INTEGER__DECIMAL:
            inner = (
              <div styleName="input-wrapper">
                <input styleName="input"
                       ref={field.nameId}
                       value={value}
                       onChange={e => this.onChange_INTEGER(e, field)}/>
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            inner = (
              <div styleName="input-wrapper">
                <input styleName="input"
                       ref={field.nameId}
                       value={value}
                       onChange={e => this.onChange_INTEGER(e, field)}/>
              </div>
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_BOOLEAN:
        if (!value)
          value = false;

        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__BOOLEAN__RADIO:
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

          case ftps.FIELD_APPEARANCE__BOOLEAN__SWITCH:
            inner = (
              <div styleName="switch-wrapper">
                <SwitchControl checked={value} onChange={v => this.onChange_BOOLEAN(v, field)}/>
              </div>
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_IMAGE:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__MEDIA__MEDIA:
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
        }
        break;

      case ftps.FIELD_TYPE_DATE:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__DATE__DATE:
            if (!value)
              value = new Date();

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
        break;

    }

    let error = this.fieldsErrors.get(field);

    return (
      <div styleName="field" key={field.nameId}>
        <div styleName="field-title">
          {field.name}
        </div>
        {inner}
        {
          error &&
            <div styleName="field-error">
              {error}
            </div>
        }
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
      <div styleName="content">
        <div styleName="field-title status">
          Status: {this.item.published ?
            <span styleName="published">Published</span>
              :
            <span styleName="draft">Draft</span>}
        </div>

        {content}

        <div styleName="buttons-wrapper">
            {
              !this.item.published &&
                <div styleName="button-publish">
                  <ButtonControl color="green"
                                 value="Publish"
                                 onClick={this.onPublish} />
                </div>
            }
          <ButtonControl color="gray"
                         value="Discard changes"
                         onClick={this.onDiscard} />
        </div>
      </div>
    );
  }

  render() {
    const {isEditable} = this.props;

    let content = this.generateContent();

    let titles = (
      <div>
        <EditableTitleControl text={this.state.title}
                              placeholder={"Item title"}
                              update={this.updateItemTitle}
                              cancel={this.endEdit} />
        <EditableTitleControl text={this.item.model.name}
                              isSmall={true} />
      </div>
    );

    return (
      <ContainerComponent hasTitle2={true}
                          titles={titles}
                          onClickBack={this.onClose}>
        {content}
      </ContainerComponent>
    );
  }
}
