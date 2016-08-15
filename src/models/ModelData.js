import {Parse} from 'parse';


export class ModelData {
  static get OriginClass() {return Parse.Object.extend("Model");}
  
  origin = null;
  
  name = "";
  description = "";
  tableName = "";
  color = "rgba(0, 0, 0, 1)";
  
  //links
  site = null;
  
  //children
  fields = [];
  
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))         this.name         = origin.get('name');
    if (origin.get('description'))  this.description  = origin.get('description');
    if (origin.get('tableName'))    this.tableName    = origin.get('tableName');
    if (origin.get('color'))        this.color        = origin.get('color');
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new ModelData.OriginClass;
    
    this.origin.set("name",         this.name);
    this.origin.set("description",  this.description);
    this.origin.set("tableName",    this.tableName);
    this.origin.set("color",        this.color);
  
    this.origin.set("site",         this.site.origin);
  }
}



export const FIELD_TYPE_SHORT_TEXT  = "FIELD_TYPE_SHORT_TEXT";
export const FIELD_TYPE_LONG_TEXT   = "FIELD_TYPE_LONG_TEXT";


export class ModelFieldData {
  static get OriginClass() {return Parse.Object.extend("ModelField");}
  
  origin = null;
  
  name = "";
  type = FIELD_TYPE_SHORT_TEXT;
  color = "rgba(0, 0, 0, 1)";
  
  //links
  model = null;
  
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))   this.name   = origin.get('name');
    if (origin.get('type'))   this.type   = origin.get('type');
    if (origin.get('color'))  this.color  = origin.get('color');
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new ModelFieldData.OriginClass;
    
    this.origin.set("name",   this.name);
    this.origin.set("type",   this.type);
    this.origin.set("color",  this.color);
  
    this.origin.set("model",  this.model.origin);
  }
}