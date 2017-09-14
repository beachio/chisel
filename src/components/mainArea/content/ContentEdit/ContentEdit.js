import React, {Component} from 'react';
import CSSModules from 'react-css-modules';


import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import EditableTitleControl from 'components/elements/EditableTitleControl/EditableTitleControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {filterSpecials, checkURL} from 'utils/common';
import {STATUS_ARCHIEVED, STATUS_PUBLISHED, STATUS_DRAFT, STATUS_UPDATED} from 'models/ContentData';
import * as ftps from 'models/ModelData';

import ContentString from './elements/ContentString';
import ContentNumber from './elements/ContentNumber';
import ContentBoolean from './elements/ContentBoolean';
import ContentDate from './elements/ContentDate';
import ContentReference from './elements/ContentReference';
import ContentMedia from './elements/ContentMedia';

import styles from './ContentEdit.sss';


const AUTOSAVE_TIMEOUT = 2000;

  
@CSSModules(styles, {allowMultiple: true})
export default class ContentEdit extends Component {
  state = {
    title: "",
    color: "rgba(0, 0, 0, 1)",
    fields: new Map(),
    dirty: false
  };
  
  item = null;
  fieldsArchive = new Map();
  addingItem = null;
  
  wait = false;
  waitSave = false;
  mediaTimeouts = {};
  
  fieldElements = [];
  fieldElementRefs = [];
  

  componentWillMount() {
    this.updateItem(this.props.item);
    this.fieldsArchive = new Map(this.item.fields);
  }

  componentWillUnmount() {
    if (this.state.dirty)
      this.saveItem();
  }
  
  componentWillReceiveProps(nextProps) {
    this.checkAddingItem(nextProps.lastItem);
    if (nextProps.item.origin.id != this.item.origin.id)
      this.updateItem(nextProps.item);
  }
  
  updateItem(item = this.item) {
    this.item = item;
    
    let draft = item.draft ? item.draft : item;
    this.setState({
      title:  draft.title,
      color:  draft.color,
      fields: draft.fields,
      dirty:  false
    });
    
    this.waitSave = false;
  }
  
  saveItem() {
    this.props.updateItem(this.item);
  }

  onClose = () => {
    this.props.onClose();
  };

  onDiscard = () => {
    if (this.item.status == STATUS_DRAFT || this.item.status == STATUS_ARCHIEVED)
      this.item.fields = new Map(this.fieldsArchive);
    
    this.props.discardItem(this.item);
    this.updateItem();
  };

  onPublish = () => {
    if (!this.validate())
      return;
  
    this.props.publishItem(this.item);
    this.updateItem();
  };
  
  onArchieve = () => {
    this.props.archieveItem(this.item);
    this.updateItem();
  };
  
  onRestore = () => {
    this.props.restoreItem(this.item);
    this.updateItem();
  };
  
  setFieldValue = (field, value, save = false) => {
    let fields = this.state.fields;
    this.setState({fields: fields.set(field, value), dirty: true});
    
    if (save || !this.wait) {
      this.saveItem();
      this.wait = true;
      
      setTimeout(() => {
        if (this.waitSave)
          this.saveItem();
        this.waitSave = false;
        this.wait = false;
      
        }, AUTOSAVE_TIMEOUT);
    
    } else {
      this.waitSave = true;
    }
  };

  validate() {
    for (let elm of this.fieldElementRefs) {
      if (!elm.validate())
        return false;
    }

    return true;
  };
  
  updateItemTitle = title => {
    this.setState({title});
    let draft = this.item.draft ? this.item.draft : this.item;
    draft.title = title;
  };
  
  addItem = item => {
    this.addingItem = item;
    this.props.addItem(item);
  };
  
  checkAddingItem(lastItem) {
    if (this.addingItem && lastItem == this.addingItem) {
      this.props.gotoItem(this.addingItem);
      this.addingItem = null;
    }
  }
  
  onReferenceClick = newItem => {
    this.saveItem();
    this.props.gotoItem(newItem);
  };

  generateElement(field, value, ref) {
    let {isEditable} = this.props;
    if (this.item.status == STATUS_ARCHIEVED)
      isEditable = false;

    switch (field.type) {
      case ftps.FIELD_TYPE_SHORT_TEXT:
      case ftps.FIELD_TYPE_LONG_TEXT:
        return <ContentString ref={ref}
                              field={field}
                              key={field.nameId}
                              value={value}
                              isEditable={isEditable}
                              setFieldValue={this.setFieldValue}
                              showModal={this.props.showModal}
                              updateItemTitle={this.updateItemTitle} />;
        break;

      case ftps.FIELD_TYPE_FLOAT:
      case ftps.FIELD_TYPE_INTEGER:
        return <ContentNumber ref={ref}
                              field={field}
                              key={field.nameId}
                              value={value}
                              isEditable={isEditable}
                              setFieldValue={this.setFieldValue} />;
        break;

      case ftps.FIELD_TYPE_BOOLEAN:
        return <ContentBoolean ref={ref}
                               field={field}
                               key={field.nameId}
                               value={value}
                               isEditable={isEditable}
                               setFieldValue={this.setFieldValue} />;
        break;

      case ftps.FIELD_TYPE_DATE:
        return <ContentDate ref={ref}
                            field={field}
                            key={field.nameId}
                            value={value}
                            isEditable={isEditable}
                            setFieldValue={this.setFieldValue} />;
        break;
  
      case ftps.FIELD_TYPE_MEDIA:
        return <ContentMedia ref={ref}
                             field={field}
                             key={field.nameId}
                             value={value}
                             isEditable={isEditable}
                             setFieldValue={this.setFieldValue}
                             site={this.item.model.site}
                             addMediaItem={this.props.addMediaItem}
                             updateMediaItem={this.props.updateMediaItem}
                             removeMediaItem={this.props.removeMediaItem}
                             showModal={this.props.showModal} />;
        break;

      case ftps.FIELD_TYPE_REFERENCES:
        return <ContentReference ref={ref}
                                 field={field}
                                 key={field.nameId}
                                 value={value}
                                 item={this.item}
                                 isEditable={isEditable}
                                 setFieldValue={this.setFieldValue}
                                 showModal={this.props.showModal}
                                 addItem={this.addItem}
                                 onReferenceClick={this.onReferenceClick} />;
        break;

    }
  }

  generateContent() {
    const {isEditable} = this.props;

    this.fieldElements = [];
    this.fieldElementRefs = [];
    for (let [field, value] of this.state.fields) {
      if (field.isDisabled)
        continue;

      let ref = e => {
        if (e)
          this.fieldElementRefs.push(e);
      };
      let elm = this.generateElement(field, value, ref);
      this.fieldElements.push(elm);
    }

    return (
      <div styleName="content">
        <div styleName="field-title status">
          Status:
          <span styleName={this.item.status}> {this.item.status}</span>
        </div>

        {this.fieldElements}

        {
          isEditable &&
            <div styleName="buttons-wrapper">
              <div styleName="button-publish">
                <ButtonControl color="green"
                               value="Publish"
                               disabled={this.item.status == STATUS_PUBLISHED || this.item.status == STATUS_ARCHIEVED}
                               onClick={this.onPublish}/>
              </div>
              <div styleName="button-publish">
                <ButtonControl color="gray"
                               value="Discard changes"
                               disabled={this.item.status != STATUS_UPDATED && !this.state.dirty}
                               onClick={this.onDiscard}/>
              </div>
              {
                this.item.status == STATUS_ARCHIEVED ?
                  <div styleName="button-publish">
                    <ButtonControl color="gray"
                                   value="Restore from archieve"
                                   onClick={this.onRestore}/>
                  </div>
                :
                  <div styleName="button-publish">
                    <ButtonControl color="gray"
                                   value="Archieve"
                                   onClick={this.onArchieve}/>
                  </div>
              }
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