import {FIELD_APPEARANCE__SHORT_TEXT__SINGLE, FIELD_TYPE_SHORT_TEXT} from "./ModelData";
import {Parse} from "parse";


export class TemplateData {
  static get OriginClass() {return Parse.Object.extend("Template");}
  
  origin = null;
  
  name = '';
  description = '';
  icon = null;
  
  //children
  models = [];
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))         this.name         = origin.get('name');
    if (origin.get('description'))  this.description  = origin.get('description');
    if (origin.get('icon'))         this.icon         = origin.get('icon');
    
    return this;
  }
}

export class TemplateModelData {
  static get OriginClass() {return Parse.Object.extend("TemplateModel");}
  
  origin = null;
  
  name = "";
  nameId = "";
  description = "";
  color = "rgba(0, 0, 0, 1)";
  
  //links
  template = null;
  
  //children
  fields = [];
  
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))         this.name         = origin.get('name');
    if (origin.get('nameId'))       this.nameId       = origin.get('nameId');
    if (origin.get('description'))  this.description  = origin.get('description');
    if (origin.get('color'))        this.color        = origin.get('color');
    
    return this;
  }
}

export class TemplateModelFieldData {
  static get OriginClass() {return Parse.Object.extend("TemplateModelField");}
  
  origin = null;
  
  name = "";
  nameId = "";
  type = FIELD_TYPE_SHORT_TEXT;
  appearance = FIELD_APPEARANCE__SHORT_TEXT__SINGLE;
  color = "rgba(0, 0, 0, 1)";
  boolTextYes = '';
  boolTextNo = '';
  validValues = [];
  isRequired = false;
  isTitle = false;
  isList = false;
  isDisabled = false;
  order = -1;
  validations = null;
  
  //links
  model = null;
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))         this.name         = origin.get('name');
    if (origin.get('nameId'))       this.nameId       = origin.get('nameId');
    if (origin.get('type'))         this.type         = origin.get('type');
    if (origin.get('appearance'))   this.appearance   = origin.get('appearance');
    if (origin.get('color'))        this.color        = origin.get('color');
    if (origin.get('boolTextYes'))  this.boolTextYes  = origin.get('boolTextYes');
    if (origin.get('boolTextNo'))   this.boolTextNo   = origin.get('boolTextNo');
    if (origin.get('validValues'))  this.validValues  = origin.get('validValues');
    if (origin.get('isRequired'))   this.isRequired   = true;
    if (origin.get('isTitle'))      this.isTitle      = true;
    if (origin.get('isList'))       this.isList       = true;
    if (origin.get('isDisabled'))   this.isDisabled   = true;
    
    if (origin.get('validations'))  this.validations  = origin.get('validations');
    
    if (origin.get('order') || origin.get('order') === 0)  this.order = origin.get('order');
    
    return this;
  }
}
