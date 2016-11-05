import {Parse} from 'parse';

import {removeSpaces, filterSpecials} from 'utils/common';


export class ContentItemData {
  origin = null;
  
  color = "rgba(0, 0, 0, 1)";
  fields = new Map();
  
  //setter
  _titleField = null;
  _title = "";
  _slug = "";
  
  //links
  _model = null;
  
  
  get titleField() {return this._titleField;}
  
  get title() {return this._title;}
  set title(title) {
    this._title = removeSpaces(title);
    this.fields.set(this._titleField, this._title);
    this.slug = this._title;
  }
  
  get slug() {return this._slug;}
  set slug(slug) {
    this._slug = filterSpecials(slug);
  }
  
  get model() {return this._model;}
  set model(model) {
    this._model = model;
    
    this.fields = new Map();
    for (let field of this.model.fields) {
      this.fields.set(field, null);
      
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
    
    if (origin.get('slug'))   this.slug   = origin.get('slug');
    if (origin.get('color'))  this.color  = origin.get('color');
    
    for (let field of this.model.fields) {
      let value = origin.get(field.nameId);
      this.fields.set(field, value);
  
      if (field.isTitle)
        this._title = value;
    }
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass;
    
    this.origin.set("slug",   this.slug);
    this.origin.set("color",  this.color);
  
    for (let field of this.model.fields) {
      if (field.nameId == "color" || field.nameId == "slug")
        continue;
      let value = this.fields.get(value);
      this.origin.set(field.nameId, value);
    }
  
    this.origin.set("model",  this.model.origin);
  }
}