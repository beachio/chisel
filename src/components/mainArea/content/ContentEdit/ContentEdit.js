import React, {Component} from 'react';
import CSSModules from 'react-css-modules';


import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import EditableTitleControl from 'components/elements/EditableTitleControl/EditableTitleControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {STATUS_ARCHIVED, STATUS_PUBLISHED, STATUS_DRAFT, STATUS_UPDATED} from 'models/ContentData';
import {ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";
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
    dirty: false,
    errors: false
  };
  
  item = null;
  fieldsArchive = new Map();
  addingItem = null;
  
  wait = false;
  waitSave = false;
  
  fieldElements = [];
  fieldElementRefs = [];
  

  constructor(props) {
    super(props);

    this.item = props.item;

    const draft = this.item.draft ? this.item.draft : this.item;
    this.state = {
      title:  draft.title,
      color:  draft.color,
      fields: draft.fields,
      dirty:  false,
      errors: false
    };

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
      dirty:  false,
      errors: false
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
    if (this.item.status == STATUS_DRAFT || this.item.status == STATUS_ARCHIVED)
      this.item.fields = new Map(this.fieldsArchive);
    
    this.props.discardItem(this.item);
    this.updateItem();
  };

  onPublish = () => {
    this.setState({dirty: false});
    if (!this.validate())
      return;
  
    this.props.publishItem(this.item);
    this.updateItem();
  };
  
  onArchive = () => {
    this.props.archiveItem(this.item);
    this.updateItem();
  };
  
  onRestore = () => {
    this.props.restoreItem(this.item);
    this.updateItem();
  };
  
  onDelete = () => {
    const {showAlert, deleteItem, onClose} = this.props;
    const title = this.item.title ? this.item.title : 'content item';
  
    showAlert({
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting <strong>${title}</strong>`,
      description: "Are you sure?",
      onConfirm: () => {
        deleteItem(this.item);
        this.onClose();
      }
    });
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
    let errors = false;
    for (let elm of this.fieldElementRefs) {
      if (!elm.validate())
        errors = true;
    }

    this.setState({errors});
    return !errors;
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
    if (this.item.status == STATUS_ARCHIVED)
      isEditable = false;

    switch (field.type) {
      case ftps.FIELD_TYPE_SHORT_TEXT:
      case ftps.FIELD_TYPE_LONG_TEXT:
        return <ContentString ref={ref}
                              field={field}
                              item={this.item}
                              key={field.nameId}
                              value={value}
                              isEditable={isEditable}
                              setFieldValue={this.setFieldValue}
                              showModal={this.props.showModal}
                              updateItemTitle={this.updateItemTitle} />;

      case ftps.FIELD_TYPE_FLOAT:
      case ftps.FIELD_TYPE_INTEGER:
        return <ContentNumber ref={ref}
                              field={field}
                              item={this.item}
                              key={field.nameId}
                              value={value}
                              isEditable={isEditable}
                              setFieldValue={this.setFieldValue} />;

      case ftps.FIELD_TYPE_BOOLEAN:
        return <ContentBoolean ref={ref}
                               field={field}
                               item={this.item}
                               key={field.nameId}
                               value={value}
                               isEditable={isEditable}
                               setFieldValue={this.setFieldValue} />;

      case ftps.FIELD_TYPE_DATE:
        return <ContentDate ref={ref}
                            field={field}
                            item={this.item}
                            key={field.nameId}
                            value={value}
                            isEditable={isEditable}
                            setFieldValue={this.setFieldValue} />;
  
      case ftps.FIELD_TYPE_MEDIA:
        return <ContentMedia ref={ref}
                             field={field}
                             item={this.item}
                             key={field.nameId}
                             value={value}
                             isEditable={isEditable}
                             setFieldValue={this.setFieldValue}
                             site={this.item.model.site}
                             addMediaItem={this.props.addMediaItem}
                             updateMediaItem={this.props.updateMediaItem}
                             removeMediaItem={this.props.removeMediaItem}
                             showModal={this.props.showModal} />;

      case ftps.FIELD_TYPE_REFERENCE:
        return <ContentReference ref={ref}
                                 field={field}
                                 item={this.item}
                                 key={field.nameId}
                                 value={value}
                                 isEditable={isEditable}
                                 setFieldValue={this.setFieldValue}
                                 showModal={this.props.showModal}
                                 addItem={this.addItem}
                                 onReferenceClick={this.onReferenceClick} />;

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
        <div styleName="content-header">
          <div styleName="content-name">
            {this.item.model.name}
          </div>
          <div styleName="field-title status">
            Status:
            <span styleName={this.item.status}> {this.item.status}</span>
          </div>
        </div>
        {this.fieldElements}
        {isEditable &&
          <div styleName="buttons-wrapper">
            <div styleName="button-publish">
              <ButtonControl color="red"
                            value="Delete"
                            disabled={this.item.status == STATUS_PUBLISHED || this.item.status == STATUS_UPDATED}
                            onClick={this.onDelete}/>
            </div>
            <div styleName="button-publish">
              <ButtonControl color="black"
                             value="Discard changes"
                             disabled={this.item.status != STATUS_UPDATED && !this.state.dirty}
                             onClick={this.onDiscard}/>
            </div>
            {this.item.status == STATUS_ARCHIVED ?
              <div styleName="button-publish">
                <ButtonControl color="black"
                               value="Restore from archive"
                               onClick={this.onRestore}/>
              </div>
            :
              <div styleName="button-publish">
                <ButtonControl color="black"
                               value="Archive"
                               onClick={this.onArchive}/>
              </div>
            }
            <div styleName="button-publish button-last">
              <ButtonControl color="purple"
                             value="Publish"
                             disabled={this.item.status == STATUS_PUBLISHED || this.item.status == STATUS_ARCHIVED || (this.state.errors && !this.state.dirty)}
                             onClick={this.onPublish}/>
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
                              update={isEditable ? this.updateItemTitle : null}
                              disabled={!this.item.model.getTitle()} />
        <EditableTitleControl text={this.item.model.name}
                              isSmall={true} />
      </div>
    );

    return (
      <ContainerComponent hasTitle2={true}
                          title={this.state.title}
                          >
        {content}
      </ContainerComponent>
    );
  }
}