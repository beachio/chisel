import {Parse} from 'parse';

export class ContentItemData {
  origin = null;
  
  title = "";
  color = "rgba(0, 0, 0, 1)";
  fields = new Map();
  
  //links
  model = null;
  
  get OriginClass() {
    return Parse.Object.extend(this.model.tableName);
  }
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('title'))  this.title  = origin.get('title');
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
    this.origin.set("color",  this.color);
  
    for (let field of this.model.fields) {
      if (field.nameId == "title" || field.nameId == "color")
        continue;
      let value = this.fields.get(value);
      this.origin.set(field.nameId, "test");
    }
  
    this.origin.set("model",  this.model.origin);
  }
}