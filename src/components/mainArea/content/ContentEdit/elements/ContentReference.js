import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import ContentBase from './ContentBase';
import {MODAL_TYPE_REFERENCE, MODAL_TYPE_MODEL_CHOOSE} from 'ducks/nav';
import {checkContentExistense} from 'utils/data';
import {ContentItemData} from 'models/ContentData';

import styles from '../ContentEdit.sss';

import ImageCrossCircle from 'assets/images/cross-circle.svg';


@CSSModules(styles, {allowMultiple: true})
export default class ContentReference extends ContentBase {
  item = null;
  addingItem = null;
  validModels = null;
  
  
  constructor(props) {
    super(props);
    
    this.item = this.props.item;
  
    if (this.field.validations && this.field.validations.models && this.field.validations.models.active) {
      const modelsList = this.field.validations.models.modelsList;
      if (modelsList && modelsList.length)
        this.validModels = modelsList;
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this.item = nextProps.item;
    super.componentWillReceiveProps(nextProps);
  }
  
  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;
  
    let value = this.state.value;
    if (!value || !value.length) {
      if (this.field.isRequired)
        return 'This field is required!';
      return;
    }

    for (let item of value) {
      const exist = checkContentExistense(item);
      if (!exist)
        return 'The referred content item is not exists!';
      
      const modelId = item.model.nameId;
      if (this.validModels && this.validModels.indexOf(modelId) == -1) {
        if (this.field.validations.models.errorMsg)
          return this.field.validations.models.errorMsg;
        return 'The referred content item has an illegal model!';
      }
    }
  }
  
  onReferenceNew = () => {
    if (!this.state.isEditable)
      return;
    
    const callback = model => {
      this.addingItem = new ContentItemData();
      this.addingItem.model = model;
      this.props.addItem(this.addingItem);
  
      let refers = this.state.value;
      if (!refers)
        refers = [];
  
      this.setValue(refers.concat(this.addingItem), true);
    };
    
    this.props.showModal(MODAL_TYPE_MODEL_CHOOSE, {
      callback,
      validModels: this.validModels
    });
  };
  
  onReferencesChoose = () => {
    if (!this.state.isEditable)
      return;
    let refers = this.state.value;
    if (!refers)
      refers = [];
    this.props.showModal(MODAL_TYPE_REFERENCE,
      {
        currentItem: this.item,
        isMult: this.field.isList,
        existingItems: refers,
        validModels: this.validModels,
        callback: items => this.setValue(refers.concat(items), true)
      }
    );
  };
  
  onReferenceClear = (event, item) => {
    event.stopPropagation();
    if (!this.state.isEditable)
      return;
    
    let refers = this.state.value;
    if (this.field.isList)
      refers.splice(refers.indexOf(item), 1);
    else
      refers = undefined;
    this.setValue(refers, true);
  };
  
  getInput() {
    let value = this.state.value;
    
    let oneRefBlock = item => {
      let exist = checkContentExistense(item);
      if (this.addingItem == item)
        exist = true;
      let key = item.origin && item.origin.id ? item.origin.id : Math.random();
    
      if (exist) {
        let title = item.title ? item.title : "Untitled";
        let titleStyle = item.title ? '' : 'untitled';
      
        return (
          <div styleName="reference-item" key={key} onClick={() => this.props.onReferenceClick(item)}>
            <span styleName="reference-title">
              [{item.model.name}]
              <span styleName={titleStyle}> {title}</span>
            </span>
            <InlineSVG styleName="reference-cross"
                       src={ImageCrossCircle}
                       onClick={e => this.onReferenceClear(e, item)} />
          </div>
        );
      
      } else {
        return (
          <div styleName="reference-item" key={key} onClick={e => this.onReferenceClear(e, item)}>
            <div styleName="reference-error">Error: item was deleted. Click to reset.</div>
          </div>
        );
      }
    };
  
    let btnStyle = `reference-button`;
    if (!this.state.isEditable)
      btnStyle += ` reference-button-disabled`;
    let addRefBlock = (
      <div styleName="reference-buttons">
        <div styleName={btnStyle + ` reference-new`} onClick={this.onReferenceNew}>
          Create new entry
        </div>
        <div styleName={btnStyle + ` reference-insert`} onClick={this.onReferencesChoose}>
          Insert Existing Entry
        </div>
      </div>
    );
  
    let refInner = addRefBlock;
  
    if (this.field.isList) {
      if (value && value.length)
        refInner = (
          <div>
            {value.map(oneRefBlock)}
            {addRefBlock}
          </div>
        );
    
    } else {
      if (value && value.length)
        refInner = oneRefBlock(value[0]);
    }
  
    return (
      <div styleName="reference">
        {refInner}
      </div>
    );
  }
  
}
