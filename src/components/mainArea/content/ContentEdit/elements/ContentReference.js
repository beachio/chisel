import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import ContentBase from './ContentBase';
import {MODAL_TYPE_REFERENCE, MODAL_TYPE_MODEL_CHOOSE} from 'ducks/nav';
import {checkContentExistense} from 'utils/data';
import {ContentItemData} from 'models/ContentData';

import styles from '../ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentReference extends ContentBase {
  item = null;
  addingItem = null;
  
  constructor(props) {
    super(props);
    
    this.item = this.props.item;
  }
  
  componentWillReceiveProps(nextProps) {
    this.item = nextProps.item;
  }
  
  onReferenceNew = () => {
    if (!this.state.isEditable)
      return;
    
    this.props.showModal(MODAL_TYPE_MODEL_CHOOSE, {
      callback: model => {
        this.addingItem = new ContentItemData();
        this.addingItem.model = model;
        this.props.addItem(this.addingItem);
        
        let refers = this.state.value;
        if (!refers)
          refers = [];
        
        this.setValue(refers.concat(this.addingItem), true);
      }
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
        callback: items => this.setValue(refers.concat(items), true)
      }
    );
  };
  
  onReferenceClear = (event, item) => {
    event.stopPropagation();
    if (!this.state.isEditable)
      return;
    
    let refers = this.state.value;
    if (item)
      refers.splice(refers.indexOf(item), 1);
    else
      refers.splice(0, refers.length);
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
                       src={require('assets/images/cross.svg')}
                       onClick={e => this.onReferenceClear(e, item)} />
          </div>
        );
      
      } else {
        return (
          <div styleName="reference-item" key={key} onClick={e => this.onReferenceClear(e, item)}>
            <input type="text" value="Error: item was deleted" readOnly />
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
