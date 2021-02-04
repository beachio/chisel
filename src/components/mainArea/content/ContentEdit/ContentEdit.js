import React, {Component} from 'react';
import CSSModules from 'react-css-modules';


import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
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
  item = this.props.item;

  state = {
    title: "",
    color: "rgba(0, 0, 0, 1)",
    fields: new Map(),
    dirty: false,
    errors: false,

    newData: false,
    oldItemData: null,
    oldItemId: null
  };

  fieldsArchive = new Map(this.item.fields);
  addingItem = null;

  wait = false;
  waitSave = false;

  fieldElements = [];
  fieldElementRefs = [];


  constructor(props) {
    super(props);

    const draft = this.item.draft ? this.item.draft : this.item;
    this.state = {
      title:  draft.title,
      color:  draft.color,
      fields: new Map(draft.fields),
      dirty:  false,
      errors: false,
      oldItemData: draft.toJSON(),
      oldItemId: draft.origin.id
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {item} = props;
    const {oldItemData, oldItemId} = state;
    const draft = item.draft ? item.draft : item;
    const sameId = oldItemId == item.origin.id || oldItemId == draft.origin.id;
    if (JSON.stringify(draft) != JSON.stringify(oldItemData) && sameId) {
      return {newData: true};
    }
    return null;
  }

  componentWillUnmount() {
    this.props.closeNotification();
    if (this.state.dirty)
      this.saveItem();
  }

  checkAddingItem(lastItem) {
    if (this.addingItem && lastItem == this.addingItem) {
      this.props.gotoItem(this.addingItem);
      this.addingItem = null;
    }
  }

  updateItem(item = this.item) {
    this.item = item;

    let draft = item.draft ? item.draft : item;
    this.setState({
      title:  draft.title,
      color:  draft.color,
      fields: new Map(draft.fields),
      dirty:  false,
      errors: false,

      oldItemData: draft.toJSON(),
      oldItemId: draft.origin.id,
      newData: false
    });

    this.waitSave = false;
  }

  componentDidUpdate() {
    const {item, lastItem, showNotification} = this.props;
    this.checkAddingItem(lastItem);
    if (item.origin.id != this.item.origin.id)
      this.updateItem(item);

    if (this.state.newData) {
      showNotification({
        text: 'There are some changes. What do you want to do?',
        confirmLabel: 'Load new data',
        cancelLabel: 'Keep my data',
        onConfirm: this.loadNewData
      });
    }
  }

  loadNewData = () => {
    this.updateItem(this.props.item);
  };

  saveItem() {
    const draft = this.item.draft ? this.item.draft : this.item;
    draft.fields = new Map(this.state.fields);
    draft.title = this.state.title;
    this.setState({
      oldItemData: draft.toJSON(),
      oldItemId: draft.origin.id
    }, () => {
      this.props.updateItem(this.item);
    });
  }

  renderTitle = () => {
    const {gotoList} = this.props;
    return (
      <span>
        <span styleName="back-link" onClick={gotoList}>Content</span>
        <span> / </span>
        <span styleName="item-title">{this.state.title || 'Untitled'}</span>
      </span>
    );
  };

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
    const {showAlert, deleteItem} = this.props;
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
    const fields = new Map(this.state.fields);
    fields.set(field, value);
    this.setState({fields, dirty: true}, () => {
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
    });
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
  };

  addItem = item => {
    this.addingItem = item;
    this.props.addItem(item);
  };

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
                             value="Discard Changes"
                             disabled={this.item.status != STATUS_UPDATED && !this.state.dirty}
                             onClick={this.onDiscard}/>
            </div>
            {this.item.status == STATUS_ARCHIVED ?
              <div styleName="button-publish">
                <ButtonControl color="black"
                               value="Restore From Archive"
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
    return (
      <ContainerComponent hasTitle2={true}
                          title={this.renderTitle()}>
        {this.generateContent()}
      </ContainerComponent>
    );
  }
}
