import {Parse} from 'parse';

import {removeSpaces, filterSpecials} from 'utils/common';


export class ContentItemData {
  origin = null;
  
  color = "rgba(0, 0, 0, 1)";
  fields = new Map();
  
  //setter
  _title = "";
  _slug = "";
  
  //links
  model = null;
  
  get title() {return this._title;}
  set title(title) {
    this._title = removeSpaces(title);
    this.slug = this._title;
  }
  
  get slug() {return this._slug;}
  set slug(slug) {
    this._slug = filterSpecials(slug);
  }
  
  get OriginClass() {
    return Parse.Object.extend(this.model.tableName);
  }
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('title'))  this.title  = origin.get('title');
    if (origin.get('slug'))   this.slug   = origin.get('slug');
    if (origin.get('color'))  this.color  = origin.get('color');
    
    for (let field of this.model.fields) {
      let value = origin.get(field.nameId);
      this.fields.set(field, value);
    }
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass;
    
    this.origin.set("title",  this.title);
    this.origin.set("slug",   this.slug);
    this.origin.set("color",  this.color);
  
    for (let field of this.model.fields) {
      if (field.nameId == "title" || field.nameId == "color" || field.nameId == "slug")
        continue;
      let value = this.fields.get(value);
      this.origin.set(field.nameId, value);
    }
  
    this.origin.set("model",  this.model.origin);
  }
}