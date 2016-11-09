import {Parse} from 'parse';

import {removeSpaces, filterSpecials} from 'utils/common';


export class SiteData {
  static get OriginClass() {return Parse.Object.extend("Site");}

  origin = null;

  domain = "";

  //setter
  _name = "";
  _nameId = "";

  //links
  owner = null;

  //children
  collaborations = [];
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

    if (origin.get('name'))   this.name   = origin.get('name');
    if (origin.get('nameId')) this.nameId = origin.get('nameId');
    if (origin.get('domain')) this.domain = origin.get('domain');

    return this;
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new SiteData.OriginClass;

    this.origin.set("name",   this.name);
    this.origin.set("nameId", this.nameId);
    this.origin.set("domain", this.domain);

    this.origin.set("owner",  this.owner.origin);
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
    this.tableName = `content__${this.site.nameId}__${this.nameId}`;
  }

  toJSON() {
    return {
      name:         this.name,
      nameId:       this.nameId,
      description:  this.description,
      tableName:    this.tableName,
      color:        this.color,
      fields:       this.fields
    };
  }
  
  hasTitle() {
    for (let field of this.fields) {
      if (field.isTitle)
        return true;
    }
    return false;
  }
}



export const FIELD_TYPE_SHORT_TEXT  = "Short Text";
export const FIELD_TYPE_LONG_TEXT   = "Long Text";
export const FIELD_TYPE_REFERENCE   = "Reference";
export const FIELD_TYPE_REFERENCES  = "References";
export const FIELD_TYPE_IMAGE       = "Image";
export const FIELD_TYPE_INTEGER     = "Number Int";
export const FIELD_TYPE_FLOAT       = "Number";
export const FIELD_TYPE_DATE        = "Date/time";
export const FIELD_TYPE_BOOLEAN     = "Boolean";
export const FIELD_TYPE_JSON        = "JSON";

export const FIELD_TYPES = [FIELD_TYPE_SHORT_TEXT, FIELD_TYPE_LONG_TEXT, FIELD_TYPE_REFERENCE, FIELD_TYPE_REFERENCES,
  FIELD_TYPE_IMAGE, FIELD_TYPE_INTEGER, FIELD_TYPE_FLOAT, FIELD_TYPE_DATE, FIELD_TYPE_BOOLEAN, FIELD_TYPE_JSON];

export const FIELD_NAMES_RESERVED = ['__slug', '__color'];


export class ModelFieldData {
  static get OriginClass() {return Parse.Object.extend("ModelField");}

  origin = null;

  type = FIELD_TYPE_SHORT_TEXT;
  color = "rgba(0, 0, 0, 1)";
  isTitle = false;

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

    if (origin.get('name'))     this.name     = origin.get('name');
    if (origin.get('nameId'))   this.nameId   = origin.get('nameId');
    if (origin.get('type'))     this.type     = origin.get('type');
    if (origin.get('color'))    this.color    = origin.get('color');
    if (origin.get('isTitle'))  this.isTitle  = true;

    return this;
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new ModelFieldData.OriginClass;
    this.origin.set("name",     this.name);
    this.origin.set("nameId",   this.nameId);
    this.origin.set("type",     this.type);
    this.origin.set("color",    this.color);
    this.origin.set("isTitle",  this.isTitle);
    this.origin.set("model",  this.model.origin);
  }

  toJSON() {
    return {
      name:     this.name,
      nameId:   this.nameId,
      type:     this.type,
      color:    this.color,
      isTitle:  this.isTitle
    };
  }
}
