import {Parse} from 'parse';

import {removeSpaces, filterSpecials} from 'utils/common';


export class ContentItemData {
  origin = null;
  
  color = "rgba(0, 0, 0, 1)";
  published = false;
  fields = new Map();
  
  //setter
  _titleField = null;
  _slug = "";
  
  //links
  _model = null;
  
  
  get titleField() {return this._titleField;}
  
  get title() {return this.fields.get(this._titleField);}
  set title(title) {
    title = removeSpaces(title);
    this.fields.set(this.titleField, title);
    this.slug = title;
  }
  
  get slug() {return this._slug;}
  set slug(slug) {
    this._slug = filterSpecials(slug);
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
    
    if (origin.get('t__slug'))       this.slug       = origin.get('t__slug');
    if (origin.get('t__published'))  this.published  = origin.get('t__published');
    if (origin.get('t__color'))      this.color      = origin.get('t__color');
    
    for (let field of this.model.fields) {
      let value = origin.get(field.nameId);
      this.fields.set(field, value);
  
      if (field.isTitle)
        this._titleField = field;
    }
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass;
    
    this.origin.set("t__slug",       this.slug);
    this.origin.set("t__published",  this.published);
    this.origin.set("t__color",      this.color);
  
    for (let [field, value] of this.fields) {
      this.origin.set(field.nameId, value);
    }
    
    this.origin.set("t__model",  this.model.origin);
  }
}