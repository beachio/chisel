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
import Editor from 'react-medium-editor';
// load theme styles with webpack
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');


import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import EditableTitleControl from 'components/elements/EditableTitleControl/EditableTitleControl';
import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {filterSpecials, trimFileExt} from 'utils/common';
import {MODAL_TYPE_MEDIA, MODAL_TYPE_WYSIWYG} from 'ducks/nav';
import {store} from 'index';

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
    let isValid = true;

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
              if (!value)
                break;

              let slug = filterSpecials(value);
              if (slug !== value)
                error = "Slug must not contain special symbols!";
              break;

            case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
              if (!value)
                break;

              let pattern = new RegExp('^(https?:\\/\\/)' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
              if (!pattern.test(value))
                error = "You must type a valid URL!";
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
              if (!value)
                value = 0;
              if (Math.floor(value) != parseFloat(value))
                error = "You must type an integer value!";
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

        case ftps.FIELD_TYPE_MEDIA:
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
        isValid = false;
    }

    return isValid;
  };

  onChange_SHORT_TEXT(event, field) {
    let value = event.target.value;
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_LONG_TEXT(event, field) {
    let value = event.target.value;
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_LONG_TEXT_WYSIWYG(text, field) {
    let value = text;
    this.setState({fields: this.state.fields.set(field, value)});
  }



  onChange_FLOAT(event, field) {
    let str = event.target.value;
    let value = parseFloat(str);
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_INTEGER(event, field) {
    let str = event.target.value;
    let value = parseFloat(str);
    this.setState({fields: this.state.fields.set(field, value)});
  }

  onChange_BOOLEAN(value, field) {
    this.setState({fields: this.state.fields.set(field, value)});
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

  onMediaChoose(field) {
    this.props.showModal(MODAL_TYPE_MEDIA,
      item => this.setState({fields: this.state.fields.set(field, item)})
    );
  }

  onMediaNew(event, field) {
    const {addMediaItem} = this.props;
    let file = event.target.files[0];
    let parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    parseFile.save().then(() => {
      addMediaItem(parseFile, trimFileExt(file.name), file.type);
      let items = store.getState().media.items;
      let item = items[items.length - 1];
      this.setState({fields: this.state.fields.set(field, item)});
    });
  }

  onMediaClear(field) {
    this.setState({fields: this.state.fields.set(field, null)});
  }

  onShowWysiwygModal(field) {
    this.props.showModal(MODAL_TYPE_WYSIWYG, field);
  }

  generateElement(field, value) {
    const {isEditable} = this.props;

    let title = (
      <div styleName="field-title">
        {field.name}
      </div>
    );

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
                       readOnly={!isEditable}
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
                       readOnly={!isEditable}
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
                       readOnly={!isEditable}
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
                       readOnly={!isEditable}
                       onChange={e => this.onChange_LONG_TEXT(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            inner = (
              <textarea styleName="textarea"
                        ref={field.nameId}
                        value={value}
                        readOnly={!isEditable}
                        onChange={e => this.onChange_LONG_TEXT(e, field)} />
            );
            break;

          case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
            title = (
              <div styleName="field-title">
                {field.name}
                <div styleName="link"
                     onClick={() => this.onShowWysiwygModal(field)} >
                  <InlineSVG styleName="link-icon" src={require('./link.svg')}/>
                </div>
              </div>
            );
            inner = (
              <Editor
                text={value}
                onChange={text => this.onChange_LONG_TEXT_WYSIWYG(text, field)}
              />
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
                       readOnly={!isEditable}
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
                       readOnly={!isEditable}
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
                       readOnly={!isEditable}
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
            let onChange = v => this.onChange_BOOLEAN(v, field);
            inner = (
              <div styleName="switch-wrapper">
                <SwitchControl checked={value} onChange={isEditable ? onChange : null}/>
              </div>
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_MEDIA:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__MEDIA__MEDIA:

            if (value && value.file) {
              let imgStyle = {backgroundImage: `url(${value.file.url()})`};
              inner = (
                <div styleName="media">
                  <div styleName="media-item">
                    <div styleName="media-header">
                      <input type="text" placeholder="Image name" value={value.name} />
                      <InlineSVG styleName="media-cross"
                                 src={require('./cross.svg')}
                                 onClick={() => this.onMediaClear(field)} />
                    </div>
                    <div styleName="media-content" style={imgStyle}>
                    </div>
                  </div>
                </div>
              );

            } else {
              inner = (
                <div styleName="media">
                  <div styleName="media-buttons">
                    <div type="file" styleName="media-button media-upload">
                      Upload New
                      <input styleName="media-hidden"
                             type="file"
                             onChange={e => this.onMediaNew(e, field)} />
                    </div>
                    <div styleName="media-button media-insert"
                         onClick={() => this.onMediaChoose(field)}>
                      Insert Existing
                    </div>
                  </div>
                </div>
              );
            }
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
                           data-click-opens={isEditable}
                           data-alt-input="true"
                           data-alt-format="F j, Y"
                           onChange={(obj, str, ins) => this.onChange_DATE(str, field)} />
                <TimePicker showSecond={false}
                            value={time}
                            disabled={!isEditable}
                            onChange={e => this.onChange_TIME(e, field)} />
              </div>
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_REFERENCE:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__REFERENCE__REFERENCE:
            inner = (
              <div styleName="reference">
                <div styleName="reference-buttons">
                  <div styleName="reference-button reference-new">
                    Create new entry
                  </div>
                  <div styleName="reference-button reference-insert">
                    Insert Existing Entry
                  </div>
                </div>

                <div styleName="reference-item">
                  <input type="text" placeholder="My Reference Title" value="My Reference Title" />
                  <InlineSVG styleName="reference-cross" src={require('./cross.svg')}/>
                </div>
              </div>
            );
            break;
        }
        break;

    }

    let error = this.fieldsErrors.get(field);

    return (
      <div styleName="field" key={field.nameId}>
        {title}
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
    const {isEditable} = this.props;

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

        {
          isEditable &&
            <div styleName="buttons-wrapper">
              {
                ///!this.item.published &&
                <div styleName="button-publish">
                  <ButtonControl color="green"
                                 value="Publish"
                                 onClick={this.onPublish}/>
                </div>
              }
              <ButtonControl color="gray"
                             value="Discard changes"
                             onClick={this.onDiscard}/>
            </div>
        }
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
                              update={isEditable ? this.updateItemTitle : null}
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
