import {Parse} from 'parse';

import {removeOddSpaces} from 'utils/common';
import {getMediaByO, getContentByO} from 'utils/data';
import {FIELD_TYPE_MEDIA, FIELD_TYPE_REFERENCES} from 'models/ModelData';


export class ContentItemData {
  origin = null;
  
  color = "rgba(0, 0, 0, 1)";
  published = false;
  fields = new Map();
  
  tempId = '(temp)' + Math.random().toFixed(10);
  
  //setter
  _titleField = null;
  
  //links
  _model = null;
  
  
  get titleField() {return this._titleField;}
  
  get title() {return this.fields.get(this._titleField);}
  set title(title) {
    if (!this.titleField)
      return;
    
    title = removeOddSpaces(title);
    this.fields.set(this.titleField, title);
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
    
    if (origin.get('t__published'))  this.published  = origin.get('t__published');
    if (origin.get('t__color'))      this.color      = origin.get('t__color');
    
    for (let field of this.model.fields) {
      let value = origin.get(field.nameId);
      if (field.type == FIELD_TYPE_MEDIA)
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
      if (field.type == FIELD_TYPE_REFERENCES) {
        let refersO = this.origin.get(field.nameId);
        if (!refersO)
          refersO = [];
        
        let refers = [];
        for (let refO of refersO) {
          let ref = getContentByO(refO, items);
          if (ref)
            refers.push(ref);
        }
        this.fields.set(field, refers);
      }
    }
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass;
    
    this.origin.set("t__published",  this.published);
    this.origin.set("t__color",      this.color);
  
    for (let [field, value] of this.fields) {
      if (field.type == FIELD_TYPE_REFERENCES && value) {
        let refOrigins = [];
        for (let ref of value) {
          if (ref.origin)
            refOrigins.push(ref.origin);
        }
        this.origin.set(field.nameId, refOrigins);
      } else if ((field.type == FIELD_TYPE_MEDIA) && value) {
        this.origin.set(field.nameId, value.origin);
      } else {
        this.origin.set(field.nameId, value);
      }
    }
    
    this.origin.set("t__model",  this.model.origin);
  }
}