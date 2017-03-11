import React, {Component, PropTypes} from 'react';
import {Parse} from 'parse';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import _ from 'lodash/core';
import ReactStars from 'react-stars';

import 'flatpickr/dist/flatpickr.min.css';
import Flatpickr from 'react-flatpickr';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import Editor from 'react-medium-editor';


import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import EditableTitleControl from 'components/elements/EditableTitleControl/EditableTitleControl';
import SwitchControl from 'components/elements/SwitchControl/SwitchControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {filterSpecials, trimFileExt, checkURL} from 'utils/common';
import {MODAL_TYPE_MEDIA, MODAL_TYPE_REFERENCE, MODAL_TYPE_WYSIWYG} from 'ducks/nav';
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
    this.setItem(this.props.item);
  }

  componentWillUnmount() {
    this.saveItem();
  }
  
  setItem(item) {
    this.item = item;
    this.setState({
      title:  item.title,
      color:  item.color,
      fields: new Map(item.fields)
    });
  }
  
  saveItem() {
    if (!this.item.published || this.validate()) {
      this.item.color = this.state.color;
      this.item.fields = this.state.fields;
      this.props.updateItem(this.item);
    }
  }

  updateItemTitle = title => {
    this.setState({title});
    for (let [field, value] of this.state.fields) {
      if (field.isTitle)
        this.setState({fields: this.state.fields.set(field, title)});
    }
  };

  onClose = () => {
    this.props.onClose();
  };

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
              
              if (!checkURL(value))
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
    this.setFieldValue(field, value);
  
    if (field.isTitle) {
      this.setState({title: value});
      for (let [tempField, tempValue] of this.state.fields) {
        if (tempField.appearance == ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG) {
          this.setState({fields: this.state.fields.set(tempField, filterSpecials(value))});
        }
      }
    }
  }

  onChange_LONG_TEXT(event, field) {
    let value = event.target.value;
    this.setFieldValue(field, value);
  }

  onChange_LONG_TEXT_WYSIWYG(text, field) {
    this.setFieldValue(field, text);
  }

  onChange_FLOAT(event, field) {
    let str = event.target.value;
    let value = !!str ? parseFloat(str) : '';
    this.setFieldValue(field, value);
  }

  onChange_INTEGER(event, field) {
    let str = event.target.value;
    let value = !!str ? parseFloat(str) : '';
    this.setFieldValue(field, value);
  }

  onChange_INTEGER__RATING(value, field) {
    value *= 2;
    this.setFieldValue(field, value);
  }

  onChange_BOOLEAN(value, field) {
    this.setFieldValue(field, value);
  }

  onChange_DATE(_date, field) {
    let date = _date[0];
    let oldDate = this.state.fields.get(field);
    if (!oldDate)
      oldDate = new Date();
    date.setHours(oldDate.getHours());
    date.setMinutes(oldDate.getMinutes());
    this.setFieldValue(field, date);
  }

  onChange_TIME(_time, field) {
    let time = _time[0];
    let date = this.state.fields.get(field);
    if (!date)
      date = new Date();
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    this.setFieldValue(field, date);
  }

  setLastMedia(field) {
    let mItems = store.getState().media.items;
    let mItem = mItems[mItems.length - 1];
    this.setFieldValue(field, mItem);
  }

  onMediaChoose(field) {
    this.props.showModal(MODAL_TYPE_MEDIA, mItem => {
      this.props.addMediaItem(mItem.file, mItem.name, mItem.type, this.item);
      this.setLastMedia(field);
    });
  }

  onMediaNew(event, field) {
    let file = event.target.files[0];
    let parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    parseFile.save().then(() => {
      const {addMediaItem} = this.props;
      addMediaItem(parseFile, trimFileExt(file.name), file.type);
      addMediaItem(parseFile, trimFileExt(file.name), file.type, this.item);
      this.setLastMedia(field);
    });
  }

  onMediaClear(field) {
    let fields = this.state.fields;
    this.props.removeMediaItem(fields.get(field));
    this.setFieldValue(field, null);
  }

  onMediaNameChange(event, field) {
    let value = event.target.value;
    let fields = this.state.fields;
    let mItem = fields.get(field);
    mItem.name = value;
    this.props.updateMediaItem(mItem);
    this.setFieldValue(field, mItem);
  }

  onReferenceChoose(field) {
    this.props.showModal(MODAL_TYPE_REFERENCE,
      item => this.setFieldValue(field, item)
    );
  }

  onReferenceNew(field) {
    //TODO
  }
  
  onReferenceMultChoose(field) {
    let refers = this.state.fields.get(field);
    if (!refers)
      refers = [];
    this.props.showModal(MODAL_TYPE_REFERENCE,
      item => this.setFieldValue(field, refers.concat(item))
    );
  }
  
  onReferenceMultNew(field) {
    //TODO
  }
  
  onReferenceClick(newItem) {
    this.saveItem();
    this.props.setCurrentItem(newItem);
    this.setItem(newItem);
  };
  
  onReferenceClear = (event, field) => {
    event.stopPropagation();
    this.setFieldValue(field, null);
  };
  
  onReferenceMultClear = (event, field, refer) => {
    event.stopPropagation();
    let refers = this.state.fields.get(field);
    refers.splice(refers.indexOf(refer), 1);
    this.setFieldValue(field, refers.slice());
  };

  onShowWysiwygModal(field) {
    this.props.showModal(
      MODAL_TYPE_WYSIWYG,
      {
        text: this.state.fields.get(field),
        callback: text =>  this.setFieldValue(field, text)
      }
    );
  }
  
  setFieldValue(field, value) {
    let fields = this.state.fields;
    this.setState({fields: fields.set(field, value)});
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
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              onChange={e => this.onChange_SHORT_TEXT(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            inner = (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              onChange={e => this.onChange_SHORT_TEXT(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
            inner = (
              <div styleName="input-wrapper url">
                <InputControl type="big"
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
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              onChange={e => this.onChange_LONG_TEXT(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            inner = (
              <textarea styleName="textarea"
                        value={value}
                        readOnly={!isEditable}
                        onChange={e => this.onChange_LONG_TEXT(e, field)} />
            );
            break;

          case ftps.FIELD_APPEARANCE__LONG_TEXT__WYSIWIG:
            if (!value)
              value = "<p></p>";

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
                styleName="wysiwig"
                text={value}
                onChange={text => this.onChange_LONG_TEXT_WYSIWYG(text, field)}
                options={{placeholder: false}}
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
                <InputControl type="big"
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
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              onChange={e => this.onChange_INTEGER(e, field)}/>
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__INTEGER__RATING:
            value *= .5;
            inner = (
              <div styleName="input-wrapper">
                <ReactStars
                  styleName="react-stars"
                  value={value}
                  onChange={e => this.onChange_INTEGER__RATING(e, field)}
                  size={32}
                  color1={'#F5F5F5'}
                  color2={'#5CA6DC'} />
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
                      <input type="text"
                             placeholder="Image name"
                             onChange={e => this.onMediaNameChange(e, field)}
                             value={value.name} />
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

            inner = (
              <div styleName="input-wrapper data-time-wrapper">
                <div styleName="date">
                  <Flatpickr value={value}
                             data-click-opens={isEditable}
                             data-alt-input="true"
                             onChange={obj => this.onChange_DATE(obj, field)} />
                </div>
                <div styleName="time">
                  <Flatpickr value={value}
                             data-click-opens={isEditable}
                             data-no-calendar={true}
                             data-enable-time={true}
                             data-alt-format="h:i K"
                             data-alt-input="true"
                             onChange={obj => this.onChange_TIME(obj, field)} />
                </div>
              </div>
            );
            break;
        }
        break;

      case ftps.FIELD_TYPE_REFERENCE:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__REFERENCE__REFERENCE:
            if (value) {
              inner = (
                <div styleName="reference">
                  <div styleName="reference-item" onClick={() => this.onReferenceClick(value)}>
                    <input type="text" value={value.title} readOnly />
                    <InlineSVG styleName="reference-cross"
                               src={require('./cross.svg')}
                               onClick={e => this.onReferenceClear(e, field)} />
                  </div>
                </div>
              );
            } else {
              inner = (
                <div styleName="reference">
                  <div styleName="reference-buttons">
                    <div styleName="reference-button reference-new" onClick={() => this.onReferenceNew(field)}>
                      Create new entry
                    </div>
                    <div styleName="reference-button reference-insert" onClick={() => this.onReferenceChoose(field)}>
                      Insert Existing Entry
                    </div>
                  </div>
                </div>
              );
            }

            break;
        }
        break;
  
      case ftps.FIELD_TYPE_REFERENCES:
        switch (field.appearance) {
          case ftps.FIELD_APPEARANCE__REFERENCES__REFERENCES:
            inner = (
              <div styleName="reference">
                {
                  value && value.length ?
                    value.map(refer => {
                      let key = refer.origin && refer.origin.id ? refer.origin.id : Math.random();
                      
                      return(
                        <div styleName="reference-item" key={key} onClick={() => this.onReferenceClick(refer)}>
                          <input type="text" value={refer.title} readOnly />
                          <InlineSVG styleName="reference-cross"
                                     src={require('./cross.svg')}
                                     onClick={e => this.onReferenceMultClear(e, field, refer)} />
                        </div>
                      );
                    })
                    :
                    null
                }
                
                <div styleName="reference-buttons">
                  <div styleName="reference-button reference-new" onClick={() => this.onReferenceMultNew(field)}>
                    Create new entry
                  </div>
                  <div styleName="reference-button reference-insert" onClick={() => this.onReferenceMultChoose(field)}>
                    Insert Existing Entry
                  </div>
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
