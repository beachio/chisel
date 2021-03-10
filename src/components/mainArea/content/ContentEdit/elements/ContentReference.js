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
  addingItem = null;
  validModels = null;


  constructor(props) {
    super(props);

    const {validations} = this.state.field;
    if (validations && validations.models && validations.models.active) {
      const modelsList = validations.models.modelsList;
      if (modelsList && modelsList.length)
        this.validModels = modelsList;
    }
  }

  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;

    const {value, field} = this.state;

    if (!value || !value.length) {
      if (field.isRequired)
        return 'This field is required!';
      return;
    }

    for (let item of value) {
      const exist = checkContentExistense(item);
      if (!exist)
        return 'The referred content item is not exists!';

      const modelId = item.model.nameId;
      if (this.validModels && this.validModels.indexOf(modelId) == -1) {
        if (field.validations.models.errorMsg)
          return field.validations.models.errorMsg;
        return 'The referred content item has an illegal model!';
      }
    }
  }

  onReferenceNew = () => {
    if (!this.props.isEditable)
      return;

    const callback = model => {
      this.addingItem = new ContentItemData(model);
      this.props.addItem(this.addingItem, this.state.field);
    };

    this.props.showModal(MODAL_TYPE_MODEL_CHOOSE, {
      callback,
      validModels: this.validModels
    });
  };

  onReferencesChoose = () => {
    if (!this.props.isEditable)
      return;
    let refers = this.state.value;
    if (!refers)
      refers = [];
    this.props.showModal(MODAL_TYPE_REFERENCE,
      {
        currentItem: this.props.item,
        isMult: this.state.field.isList,
        existingItems: refers,
        validModels: this.validModels,
        callback: items => this.setValue(refers.concat(items), true)
      }
    );
  };

  onReferenceClear = (event, item) => {
    event.stopPropagation();
    if (!this.props.isEditable)
      return;

    let refers = this.state.value;
    if (this.state.field.isList)
      refers.splice(refers.indexOf(item), 1);
    else
      refers = [];
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
    if (!this.props.isEditable)
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

    if (this.state.field.isList) {
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
