import {Parse} from 'parse';

export class ContentItemData {
  origin = null;
  
  title = "";
  fields = new Map();
  
  //links
  model = null;
  
  get OriginClass() {
    return Parse.Object.extend(this.model.tableName);
  }
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('title'))  this.title  = origin.get('title');
    
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
  
    for (let field of this.model.fields) {
      let value = this.fields.get(value);
      this.origin.set(field.nameId, value);
    }
  
    this.origin.set("model",  this.model.origin);
  }
}