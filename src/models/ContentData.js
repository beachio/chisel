import {Parse} from 'parse';

import {removeSpaces} from 'utils/common';
import {getMediaByO, getContentByO} from 'utils/data';
import {FIELD_TYPE_MEDIA, FIELD_TYPE_REFERENCE} from 'models/ModelData';


export class ContentItemData {
  origin = null;
  
  color = "rgba(0, 0, 0, 1)";
  published = false;
  fields = new Map();
  
  //setter
  _titleField = null;
  
  //links
  _model = null;
  
  
  get titleField() {return this._titleField;}
  
  get title() {return this.fields.get(this._titleField);}
  set title(title) {
    if (!this.titleField)
      return;
    
    title = removeSpaces(title);
    this.fields.set(this.titleField, title);
  }
  
  get model() {return this._model;}
  set model(model) {
    this._model = model;
    
    let title = this.title;
    this.fields = new Map();
    for (let field of this.model.fields) {
      this.fields.set(field, null);
      
      if (field.isTitle)
        this._titleField = field;
    }
    if (title)
      this.title = title;
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
      if (field.type == FIELD_TYPE_REFERENCE)
        this.fields.set(field, getContentByO(this.origin.get(field.nameId), items));
    }
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass;
    
    this.origin.set("t__published",  this.published);
    this.origin.set("t__color",      this.color);
  
    for (let [field, value] of this.fields) {
      if ((field.type == FIELD_TYPE_MEDIA || field.type == FIELD_TYPE_REFERENCE) && value)
        this.origin.set(field.nameId, value.origin);
      else
        this.origin.set(field.nameId, value);
    }
    
    this.origin.set("t__model",  this.model.origin);
  }
}