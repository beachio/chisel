import {Parse} from 'parse';

import {removeSpaces, filterSpecials} from 'utils/common';


export class SiteData {
  static get OriginClass() {return Parse.Object.extend("Site");}
  
  origin = null;
  
  domain = "";
  owner = null;
  collaborations = [];

  //setter
  _name = "";
  _nameId = "";
  
  //children
  models = [];

  get name() {return this._name;}
  set name(name) {
    this._name = removeSpaces(name);
    this.nameId = this._name;
  }

  get nameId() {return this._nameId;}
  set nameId(nameId) {
    this._nameId = filterSpecials(nameId);
  }
  
  setOrigin(origin) {
    this.origin = origin;
  
    if (origin.get('name'))           this.name           = origin.get('name');
    if (origin.get('nameId'))         this.nameId         = origin.get('nameId');
    if (origin.get('domain'))         this.domain         = origin.get('domain');
    if (origin.get('owner'))          this.owner          = origin.get('owner');
    if (origin.get('collaborations')) this.collaborations = origin.get('collaborations');
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new SiteData.OriginClass;
  
    this.origin.set("name",           this.name);
    this.origin.set("nameId",         this.nameId);
    this.origin.set("domain",         this.domain);
    this.origin.set("owner",          this.owner);
    this.origin.set("collaborations", this.collaborations);
  }
}


export class ModelData {
  static get OriginClass() {return Parse.Object.extend("Model");}
  
  origin = null;
  
  description = "";
  tableName = "";
  color = "rgba(0, 0, 0, 1)";

  //setter
  _name = "";
  _nameId = "";
  
  //links
  site = null;
  
  //children
  fields = [];


  get name() {return this._name;}
  set name(name) {
    this._name = removeSpaces(name);
    this.nameId = this._name;
  }

  get nameId() {return this._nameId;}
  set nameId(nameId) {
    this._nameId = filterSpecials(nameId);
  }
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))         this.name         = origin.get('name');
    if (origin.get('nameId'))       this.nameId       = origin.get('nameId');
    if (origin.get('description'))  this.description  = origin.get('description');
    if (origin.get('tableName'))    this.tableName    = origin.get('tableName');
    if (origin.get('color'))        this.color        = origin.get('color');
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new ModelData.OriginClass;
    
    this.origin.set("name",         this.name);
    this.origin.set("nameId",       this.nameId);
    this.origin.set("description",  this.description);
    this.origin.set("tableName",    this.tableName);
    this.origin.set("color",        this.color);

    this.origin.set("site",         this.site.origin);
  }

  setTableName() {
    this.tableName = `content___${this.site.nameId}___${this.nameId}`;
  }
}



export const FIELD_TYPE_SHORT_TEXT  = "Short Text";
export const FIELD_TYPE_LONG_TEXT   = "Long Text";
export const FIELD_TYPE_REFERENCE   = "Reference";
export const FIELD_TYPE_REFERENCES  = "References";
export const FIELD_TYPE_ASSET       = "Asset";
export const FIELD_TYPE_INTEGER     = "Number Int";
export const FIELD_TYPE_FLOAT       = "Number";
export const FIELD_TYPE_DATE        = "Date/time";
export const FIELD_TYPE_BOOLEAN     = "Boolean";
export const FIELD_TYPE_JSON        = "JSON";

export const FIELD_TYPES = [FIELD_TYPE_SHORT_TEXT, FIELD_TYPE_LONG_TEXT, FIELD_TYPE_REFERENCE, FIELD_TYPE_REFERENCES,
  FIELD_TYPE_ASSET, FIELD_TYPE_INTEGER, FIELD_TYPE_FLOAT, FIELD_TYPE_DATE, FIELD_TYPE_BOOLEAN, FIELD_TYPE_JSON];



export class ModelFieldData {
  static get OriginClass() {return Parse.Object.extend("ModelField");}
  
  origin = null;
  
  type = FIELD_TYPE_SHORT_TEXT;
  color = "rgba(0, 0, 0, 1)";

  //setter
  _name = "";
  _nameId = "";
  
  //links
  model = null;


  get name() {return this._name;}
  set name(name) {
    this._name = removeSpaces(name);
    this.nameId = this._name;
  }

  get nameId() {return this._nameId;}
  set nameId(nameId) {
    this._nameId = filterSpecials(nameId);
  }

  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))   this.name   = origin.get('name');
    if (origin.get('nameId')) this.nameId = origin.get('nameId');
    if (origin.get('type'))   this.type   = origin.get('type');
    if (origin.get('color'))  this.color  = origin.get('color');
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new ModelFieldData.OriginClass;
    
    this.origin.set("name",   this.name);
    this.origin.set("nameId", this.nameId);
    this.origin.set("type",   this.type);
    this.origin.set("color",  this.color);
  
    this.origin.set("model",  this.model.origin);
  }
}