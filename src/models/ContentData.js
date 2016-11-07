import {Parse} from 'parse';

import {removeSpaces, filterSpecials} from 'utils/common';


export class ContentItemData {
  origin = null;
  
  color = "rgba(0, 0, 0, 1)";
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
    
    if (origin.get('slug'))   this.slug   = origin.get('slug');
    if (origin.get('color'))  this.color  = origin.get('color');
    
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
    
    this.origin.set("slug",   this.slug);
    this.origin.set("color",  this.color);
  
    for (let [field, value] of this.fields) {
      if (field.nameId == "color" || field.nameId == "slug")
        continue;
      this.origin.set(field.nameId, value);
    }
    
    this.origin.set("model",  this.model.origin);
  }
}