import {Parse} from 'parse';

import {removeOddSpaces, filterSpecials} from 'utils/common';
import {getMediaByO, getContentByO} from 'utils/data';
import {FIELD_APPEARANCE__SHORT_TEXT__SLUG, FIELD_TYPE_MEDIA, FIELD_TYPE_REFERENCE} from 'models/ModelData';


export const STATUS_DRAFT     = `Draft`;
export const STATUS_PUBLISHED = `Published`;
export const STATUS_UPDATED   = `Updated`;
export const STATUS_ARCHIEVED = `Archieved`;


export class ContentItemData {
  origin = null;
  
  color = "rgba(0, 0, 0, 1)";
  status = STATUS_DRAFT;
  fields = new Map();
  
  //setter
  _titleField = null;
  
  //links
  _model = null;
  draft = null;
  owner = null;
  
  
  get titleField() {return this._titleField;}
  
  get title() {return this.fields.get(this._titleField);}
  set title(title) {
    if (!this.titleField)
      return;
    
    title = removeOddSpaces(title);
    this.fields.set(this.titleField, title);
  
    for (let [field, value2] of this.fields) {
      if (field.appearance == FIELD_APPEARANCE__SHORT_TEXT__SLUG)
        this.fields.set(field, filterSpecials(title, '-'));
    }
  }
  
  get model() {return this._model;}
  set model(model) {
    this._model = model;
    
    let oldFields = this.fields;
    this.fields = new Map();
    for (let field of this.model.fields) {
      let oldValue = oldFields.get(field);
      this.fields.set(field, oldValue);
      
      if (field.isTitle)
        this._titleField = field;
    }
  }
  
  get OriginClass() {
    if (this.model)
      return Parse.Object.extend(this.model.tableName);
    return null;
  }
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('t__status'))  this.status = origin.get('t__status');
    if (origin.get('t__color'))   this.color  = origin.get('t__color');
    
    for (let field of this.model.fields) {
      let value = origin.get(field.nameId);
      if (field.type == FIELD_TYPE_MEDIA && !field.isList)
        this.fields.set(field, getMediaByO(value));
      else
        this.fields.set(field, value);
  
      if (field.isTitle)
        this._titleField = field;
    }
    
    return this;
  }
  
  postInit(items) {
    for (let field of this.model.fields) {
      if (field.type == FIELD_TYPE_REFERENCE) {
        let refersO = this.fields.get(field);
        if (!refersO)
          refersO = [];
        
        let refers = [];
        for (let refO of refersO) {
          let ref = getContentByO(refO, items);
          if (ref)
            refers.push(ref);
        }
        this.fields.set(field, refers);
      
      } else if (field.type == FIELD_TYPE_MEDIA && field.isList) {
        let medsO = this.fields.get(field);
        if (!medsO)
          medsO = [];
  
        let meds = [];
        for (let medO of medsO) {
          let med = getMediaByO(medO, items);
          if (med)
            meds.push(med);
        }
        this.fields.set(field, meds);
      }
    }
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass;
    
    this.origin.set("t__status",  this.status);
    this.origin.set("t__color",   this.color);
  
    for (let [field, value] of this.fields) {
      const isRefList = field.type == FIELD_TYPE_REFERENCE ||
          field.type == FIELD_TYPE_MEDIA && field.isList;
      
      if (isRefList && value) {
        let refOrigins = [];
        for (let ref of value) {
          if (ref.origin)
            refOrigins.push(ref.origin);
        }
        this.origin.set(field.nameId, refOrigins);
      } else if (field.type == FIELD_TYPE_MEDIA && value) {
        this.origin.set(field.nameId, value.origin);
      } else {
        this.origin.set(field.nameId, value);
      }
    }
    
    this.origin.set("t__model",  this.model.origin);
    if (this.owner)
      this.origin.set("t__owner",  this.owner.origin);
  }
}


export const FIELD_NAMES_RESERVED = ['t__color', `t__status`, 't__owner', 't__model'];