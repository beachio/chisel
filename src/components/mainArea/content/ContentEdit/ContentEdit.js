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
import {checkContentExistense} from 'utils/data';
import {MODAL_TYPE_MEDIA, MODAL_TYPE_REFERENCE, MODAL_TYPE_WYSIWYG, MODAL_TYPE_MODEL_CHOOSE} from 'ducks/nav';
import {ContentItemData, STATUS_ARCHIEVED, STATUS_PUBLISHED, STATUS_DRAFT, STATUS_UPDATED} from 'models/ContentData';
import * as ftps from 'models/ModelData';
import {MediaItemData} from 'models/MediaItemData';


import styles from './ContentEdit.sss';


const AUTOSAVE_TIMEOUT = 2000;

  
@CSSModules(styles, {allowMultiple: true})
export default class ContentEdit extends Component {
  state = {
    title: "",
    color: "rgba(0, 0, 0, 1)",
    fields: new Map(),
    fieldsErrors: new Map(),
    dirty: false
  };
  item = null;
  fieldsArchive = new Map();
  timeout = 0;
  mediaTimeouts = {};
  addingItem = null;
  

  componentWillMount() {
    this.setItem(this.props.item);
  }

  componentWillUnmount() {
    if (this.state.dirty)
      this.saveItem();
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.item != nextProps.item)
      this.setItem(nextProps.item);
    this.checkAddingItem(nextProps.lastItem);
  }
  
  setItem(item) {
    this.item = item;
    this.fieldsArchive = new Map(item.fields);
    
    let draft = item.draft ? item.draft : item;
    this.setState({
      title:  draft.title,
      color:  draft.color,
      fields: new Map(draft.fields)
    });
  }
  
  saveItem() {
    if (this.validate()) {
      if (this.item.draft)
        this.item.draft.fields = this.state.fields;
      else
        this.item.fields = this.state.fields;
      this.props.updateItem(this.item);
      clearTimeout(this.timeout);
    }
    this.timeout = 0;
  }

  updateItemTitle = title => {
    this.setState({title});
    
    for (let [field, value] of this.state.fields) {
      if (field.isTitle) {
        this.setState({fields: this.state.fields.set(field, title)});
        
        for (let [field2, value2] of this.state.fields) {
          if (field2.appearance == ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG)
            this.setFieldValue(field2, filterSpecials(title));
        }
        
        break;
      }
    }
  };

  onClose = () => {
    this.props.onClose();
  };

  onDiscard = () => {
    //this.setState({fields: new Map(this.fieldsArchive)});
    this.props.discardItem(this.item);
    this.setState({dirty: false});
  };

  onPublish = () => {
    if (!this.validate())
      return;
  
    this.item.fields = this.state.fields;
    this.props.publishItem(this.item);
    this.setState({dirty: false});
    //this.onClose();
  };
  
  onArchieve = () => {
    if (!this.validate())
      return;
    
    this.item.fields = this.state.fields;
    this.props.archieveItem(this.item);
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
                error = "Title must be present!";
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

      let fieldErrors = this.state.fieldsErrors;
      fieldErrors.set(field, error);
      this.setState({fieldErrors});
      if (error)
        isValid = false;
    }

    return isValid;
  };

  onChange_STRING(event, field, i) {
    let value = event.target.value;
    
    if (field.isList) {
      let items = this.state.fields.get(field);
      if (!items)
        items = [];
      
      if (value)
        items[i] = value;
      else
        items.splice(i, 1);
      
      this.setFieldValue(field, items);
      
    } else {
      this.setFieldValue(field, value);
      if (field.isTitle)
        this.updateItemTitle(value);
    }
  }

  onChange_LONG_TEXT_WYSIWYG(text, field) {
    this.setFieldValue(field, text);
  }

  onKeyDown_TEXT = (event, field, i, inputs) => {
    event.stopPropagation();
    
    let code = event.keyCode;
    
    //Enter or down pressed
    if (code == 13 || code == 40) {
      if (inputs[i + 1]) {
        let items = this.state.fields.get(field);
        if (items[i])
          inputs[i + 1].focus();
      }
    
    //up pressed
    } else if (code == 38) {
      if (i)
        inputs[--i].focus();
    }
  };
  
  onKeyDown_INTEGER = (event, field, i, inputs) => {
    event.stopPropagation();
    
    let code = event.keyCode;
    
    //Enter or down pressed
    if (code == 13 || code == 40) {
      if (inputs[i + 1]) {
        let items = this.state.fields.get(field);
        let num = parseInt(items[i]);
        if (!isNaN(num))
          inputs[i + 1].focus();
        else
          this.onBlur_INTEGER(field, i);
      }
      
      //up pressed
    } else if (code == 38) {
      if (i)
        inputs[--i].focus();
    }
  };
  
  onKeyDown_FLOAT = (event, field, i, inputs) => {
    event.stopPropagation();
    
    let code = event.keyCode;
    
    //Enter or down pressed
    if (code == 13 || code == 40) {
      if (inputs[i + 1]) {
        let items = this.state.fields.get(field);
        let num = parseFloat(items[i]);
        if (!isNaN(num))
          inputs[i + 1].focus();
        else
          this.onBlur_FLOAT(field, i);
      }
      
      //up pressed
    } else if (code == 38) {
      if (i)
        inputs[--i].focus();
    }
  };
  
  onBlur_INTEGER(field, i) {
    if (field.isList) {
      let items = this.state.fields.get(field);
      if (!items)
        return;
      
      let num = parseInt(items[i]);
      if (!isNaN(num))
        items[i] = num;
      else
        items.splice(i, 1);
      
      this.setFieldValue(field, items);
      
    } else {
      let str = this.state.fields.get(field);
      this.setFieldValue(field, parseInt(str));
    }
  }
  
  onBlur_FLOAT(field, i) {
    if (field.isList) {
      let items = this.state.fields.get(field);
      if (!items)
        return;
    
      let num = parseFloat(items[i]);
      if (!isNaN(num))
        items[i] = num;
      else
        items.splice(i, 1);
    
      this.setFieldValue(field, items);
    
    } else {
      let str = this.state.fields.get(field);
      this.setFieldValue(field, parseFloat(str));
    }
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

  onMediaChoose(field) {
    this.props.showModal(MODAL_TYPE_MEDIA, {
      isMult: field.isList,
      
      callback: itemsSrc => {
        let newItems = [];
        for (let itemSrc of itemsSrc) {
          let item = itemSrc.clone();
          this.props.addMediaItem(item);
          newItems.push(item);
        }
        
        if (field.isList) {
          let items = this.state.fields.get(field);
          if (!items)
            items = [];
          this.setFieldValue(field, items.concat(newItems), true);
          
        } else {
          this.setFieldValue(field, newItems[0], true);
        }
      }
    });
  }

  onMediaNew(event, field) {
    let file = event.target.files[0];
    let parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    parseFile.save().then(() => {
      const {addMediaItem} = this.props;
      
      let item = new MediaItemData();
      item.file = parseFile;
      item.name = trimFileExt(file.name);
      item.type = file.type;
      addMediaItem(item);
  
      item = item.clone();
      addMediaItem(item);
  
      if (field.isList) {
        let items = this.state.fields.get(field);
        if (!items)
          items = [];
        this.setFieldValue(field, items.concat(item), true);
      } else {
        this.setFieldValue(field, item, true);
      }
    });
  }

  onMediaClear(field, item) {
    this.props.removeMediaItem(item);
    
    if (field.isList) {
      let items = this.state.fields.get(field);
      items.splice(items.indexOf(item), 1);
      this.setFieldValue(field, items, true);
    } else {
      this.setFieldValue(field, null, true);
    }
  }

  onMediaNameChange(event, field, item) {
    let value = event.target.value;
    item.name = value;
    
    if (!this.mediaTimeouts[item.key])
      this.mediaTimeouts[item.key] = setTimeout(() => {
        this.props.updateMediaItem(item);
        this.mediaTimeouts[item.key] = 0;
      }, AUTOSAVE_TIMEOUT);
    
    this.setFieldValue(field, this.state.fields.get(field));
  }

  onReferenceNew(field) {
    this.props.showModal(MODAL_TYPE_MODEL_CHOOSE, {
      callback: model => {
        this.addingItem = new ContentItemData();
        this.addingItem.model = model;
        this.props.addItem(this.addingItem);
  
        let refers = this.state.fields.get(field);
        if (!refers)
          refers = [];
        
        this.setFieldValue(field, refers.concat(this.addingItem), true);
      }
    });
  }
  
  checkAddingItem(lastItem) {
    if (this.addingItem && lastItem == this.addingItem) {
      this.props.gotoItem(this.addingItem);
      this.addingItem = null;
    }
  }
  
  onReferencesChoose(field) {
    let refers = this.state.fields.get(field);
    if (!refers)
      refers = [];
    this.props.showModal(MODAL_TYPE_REFERENCE,
      {
        currentItem: this.item,
        isMult: field.isList,
        existingItems: refers,
        callback: items => this.setFieldValue(field, refers.concat(items), true)
      }
    );
  }
  
  onReferenceClick(newItem) {
    this.saveItem();
    this.props.gotoItem(newItem);
  };
  
  onReferenceClear = (event, field, item) => {
    event.stopPropagation();
    let refers = this.state.fields.get(field);
    if (item)
      refers.splice(refers.indexOf(item), 1);
    else
      refers.splice(0, refers.length);
    this.setFieldValue(field, refers, true);
  };

  onShowWysiwygModal(field) {
    this.props.showModal(
      MODAL_TYPE_WYSIWYG,
      {
        text: this.state.fields.get(field),
        callback: text => this.setFieldValue(field, text, true)
      }
    );
  }
  
  setFieldValue(field, value, save = false) {
    let fields = this.state.fields;
    this.setState({fields: fields.set(field, value), dirty: true});
    
    if (save)
      this.saveItem();
    else if (!this.timeout)
      this.timeout = setTimeout(() => this.saveItem(), AUTOSAVE_TIMEOUT);
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
            let innerStr;
            
            if (field.isList) {
              if (!value)
                value = [];
  
              innerStr = [];
              let inputs = [];
              for (let i = 0; i < value.length + 1; i++) {
                innerStr.push(<InputControl type="big"
                                            key={i}
                                            value={value[i]}
                                            readOnly={!isEditable}
                                            DOMRef={inp => inputs[i] = inp}
                                            onChange={e => this.onChange_STRING(e, field, i)}
                                            onKeyDown={e => this.onKeyDown_TEXT(e, field, i, inputs)} />);
              }
              
            } else {
              innerStr = <InputControl type="big"
                                       value={value}
                                       readOnly={!isEditable}
                                       onChange={e => this.onChange_STRING(e, field)}/>;
            }
  
            inner = (
              <div styleName="input-wrapper">
                {innerStr}
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__SLUG:
            inner = (
              <div styleName="input-wrapper">
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              onChange={e => this.onChange_STRING(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__SHORT_TEXT__URL:
            inner = (
              <div styleName="input-wrapper url">
                <InputControl type="big"
                              value={value}
                              readOnly={!isEditable}
                              onChange={e => this.onChange_STRING(e, field)} />
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
                              onChange={e => this.onChange_STRING(e, field)} />
              </div>
            );
            break;

          case ftps.FIELD_APPEARANCE__LONG_TEXT__MULTI:
            inner = (
              <textarea styleName="textarea"
                        value={value}
                        readOnly={!isEditable}
                        onChange={e => this.onChange_STRING(e, field)} />
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
            let innerFloat;
  
            if (field.isList) {
              if (!value)
                value = [];
  
              innerFloat = [];
              let inputs = [];
              for (let i = 0; i < value.length + 1; i++) {
                innerFloat.push(<InputControl type="big"
                                              key={i}
                                              value={value[i]}
                                              readOnly={!isEditable}
                                              onChange={e => this.onChange_STRING(e, field, i)}
                                              DOMRef={inp => inputs[i] = inp}
                                              onBlur={e => this.onBlur_FLOAT(field, i)}
                                              onKeyDown={e => this.onKeyDown_FLOAT(e, field, i, inputs)} />);
              }
    
            } else {
              innerFloat = <InputControl type="big"
                                         value={value}
                                         readOnly={!isEditable}
                                         onChange={e => this.onChange_STRING(e, field)}
                                         onBlur={e => this.onBlur_FLOAT(field)} />;
            }
  
            inner = (
              <div styleName="input-wrapper">
                {innerFloat}
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
            let innerInt;
  
            if (field.isList) {
              if (!value)
                value = [];
  
              innerInt = [];
              let inputs = [];
              for (let i = 0; i < value.length + 1; i++) {
                innerInt.push(<InputControl type="big"
                                            key={i}
                                            value={value[i]}
                                            readOnly={!isEditable}
                                            onChange={e => this.onChange_STRING(e, field, i)}
                                            DOMRef={inp => inputs[i] = inp}
                                            onBlur={e => this.onBlur_INTEGER(field, i)}
                                            onKeyDown={e => this.onKeyDown_INTEGER(e, field, i, inputs)} />);
              }
    
            } else {
              innerInt = <InputControl type="big"
                                       value={value}
                                       readOnly={!isEditable}
                                       onChange={e => this.onChange_STRING(e, field)}
                                       onBlur={e => this.onBlur_INTEGER(field)}
                                       onKeyDown={this.onKeyDown} />;
            }
  
            inner = (
              <div styleName="input-wrapper">
                {innerInt}
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
        let oneMediaBlock = item => {
          let imgStyle = {backgroundImage: `url(${item.file.url()})`};
          
          return (
            <div styleName="media-item" key={item.key}>
              <div styleName="media-header">
                <input type="text"
                       placeholder="Image name"
                       onChange={e => this.onMediaNameChange(e, field, item)}
                       value={item.name} />
                <InlineSVG styleName="media-cross"
                           src={require('./cross.svg')}
                           onClick={() => this.onMediaClear(field, item)} />
              </div>
              <div styleName="media-content" style={imgStyle}></div>
            </div>
          );
        };
        
        let addMediaBlock = (
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
        );
  
        let mediaInner = addMediaBlock;
        if (field.isList) {
          if (value && value.length)
            mediaInner = (
              <div>
                {value.map(item => oneMediaBlock(item))}
                {addMediaBlock}
              </div>
            );
    
        } else {
          if (value && value.file)
            mediaInner = oneMediaBlock(value);
        }
  
        inner = (
          <div styleName="media">
            {mediaInner}
          </div>
        );
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

      case ftps.FIELD_TYPE_REFERENCES:
        let oneRefBlock = item => {
          let exist = checkContentExistense(item);
          let key = item.origin && item.origin.id ? item.origin.id : Math.random();
  
          if (exist) {
            let title = item.title ? item.title : "Untitled";
            let titleStyle = item.title ? '' : 'untitled';
            
            return (
              <div styleName="reference-item" key={key} onClick={() => this.onReferenceClick(item)}>
                <span styleName="reference-title">
                  [{item.model.name}]
                  <span styleName={titleStyle}>{title}</span>
                </span>
                <InlineSVG styleName="reference-cross"
                           src={require('./cross.svg')}
                           onClick={e => this.onReferenceClear(e, field, item)} />
              </div>
            );
            
          } else {
            return (
              <div styleName="reference-item" key={key} onClick={e => this.onReferenceClear(e, field, item)}>
                <input type="text" value="Error: item was deleted" readOnly />
              </div>
            );
          }
        };
        
        let addRefBlock = (
          <div styleName="reference-buttons">
            <div styleName="reference-button reference-new" onClick={() => this.onReferenceNew(field)}>
              Create new entry
            </div>
            <div styleName="reference-button reference-insert" onClick={() => this.onReferencesChoose(field)}>
              Insert Existing Entry
            </div>
          </div>
        );
  
        let refInner = addRefBlock;
  
        if (field.isList) {
          if (value && value.length)
            refInner = (
              <div>
                {value.map(item => oneRefBlock(item))}
                {addRefBlock}
              </div>
            );
        
        } else {
          if (value && value.length)
            refInner = oneRefBlock(value[0]);
        }
  
        inner = (
          <div styleName="reference">
            {refInner}
          </div>
        );
        break;

    }

    let error = this.state.fieldsErrors.get(field);

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
          Status:
          <span styleName={this.item.status}> {this.item.status}</span>
        </div>

        {content}

        {
          isEditable &&
            <div styleName="buttons-wrapper">
              <div styleName="button-publish">
                <ButtonControl color="green"
                               value="Publish"
                               disabled={this.item.status == STATUS_PUBLISHED}
                               onClick={this.onPublish}/>
              </div>
              <div styleName="button-publish">
                <ButtonControl color="gray"
                               value="Discard changes"
                               onClick={this.onDiscard}/>
              </div>
              <div styleName="button-publish">
                <ButtonControl color="gray"
                               value="Archieve"
                               disabled={this.item.status == STATUS_ARCHIEVED}
                               onClick={this.onArchieve}/>
              </div>
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
                              update={isEditable ? this.updateItemTitle : null} />
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
