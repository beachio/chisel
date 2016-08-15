import {Parse} from 'parse';


export class SiteData {
  static get OriginClass() {return Parse.Object.extend("Site");}
  
  origin = null;
  
  domain = "";
  owner = null;
  collaborations = [];
  
  //children
  models = [];
  
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('domain'))         this.domain         = origin.get('domain');
    if (origin.get('owner'))          this.owner          = origin.get('owner');
    if (origin.get('collaborations')) this.collaborations = origin.get('collaborations');
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new SiteData.OriginClass;
    
    this.origin.set("domain",         this.domain);
    this.origin.set("owner",          this.owner);
    this.origin.set("collaborations", this.collaborations);
  }
}


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
  
  generateTableName() {
    let domainComponents = this.site.domain.split('.');
    let domain = domainComponents.join('_');
    return `content__${this.site.origin.id}__${domain}__${this.name}`;
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