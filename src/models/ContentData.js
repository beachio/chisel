import {Parse} from 'parse';

import {removeOddSpaces, filterSpecialsAndCapital, getTextDate} from 'utils/strings';
import {getMediaByO, getContentByO} from 'utils/data';
import {
  FIELD_APPEARANCE__SHORT_TEXT__SLUG,
  FIELD_TYPE_DATE,
  FIELD_TYPE_MEDIA,
  FIELD_TYPE_REFERENCE
} from 'models/ModelData';


export const STATUS_DRAFT     = `Draft`;
export const STATUS_PUBLISHED = `Published`;
export const STATUS_UPDATED   = `Updated`;
export const STATUS_ARCHIVED  = `Archived`;


export class ContentItemData {
  origin = null;

  color = "rgba(0, 0, 0, 1)";
  status = STATUS_DRAFT;
  fields = new Map();

  deleted = false;

  //setter
  _titleField = null;

  //links
  model = null;
  draft = null;
  //when it's draft, owner — its original content item
  owner = null;


  get titleField() {return this._titleField;}

  get title() {return this.fields.get(this._titleField);}
  set title(title) {
    if (!this.titleField)
      return;

    this.fields.set(this.titleField, title);

    let slug = removeOddSpaces(title);
    slug = filterSpecialsAndCapital(title, '-');
    for (let [field, value2] of this.fields) {
      if (field.appearance == FIELD_APPEARANCE__SHORT_TEXT__SLUG)
        this.fields.set(field, slug);
    }
  }

  get OriginClass() {
    if (this.model)
      return Parse.Object.extend(this.model.tableName);
    return null;
  }

  constructor(model) {
    this.model = model;
    this.updateModel();
  }

  updateModel() {
    const oldFields = this.fields;
    this.fields = new Map();
    for (let field of this.model.fields) {
      let oldValue = oldFields.get(field);
      if (!oldValue && (field.isList || field.type == FIELD_TYPE_REFERENCE))
        oldValue = [];
      this.fields.set(field, oldValue);

      if (field.isTitle)
        this._titleField = field;
    }
  }

  setOrigin(origin) {
    this.origin = origin;

    if (origin.get('t__status'))  this.status = origin.get('t__status');
    if (origin.get('t__color'))   this.color  = origin.get('t__color');

    for (let field of this.model.fields) {
      let value = origin.get(field.nameId);
      if (field.type == FIELD_TYPE_MEDIA) {
        if (field.isList) {
          let meds_o = value;
          if (!meds_o)
            meds_o = [];

          let meds = [];
          for (let med_o of meds_o) {
            let med = getMediaByO(med_o);
            if (med)
              meds.push(med);
          }
          this.fields.set(field, meds);
        } else {
          this.fields.set(field, getMediaByO(value));
        }
      } else {
        this.fields.set(field, value);
      }

      if (field.isTitle)
        this._titleField = field;
    }

    return this;
  }

  // setting links for values of reference and media fields type
  postInit(items) {
    for (let field of this.model.fields) {
      if (field.type == FIELD_TYPE_REFERENCE) {
        let refersO = this.fields.get(field);
        if (!refersO)
          refersO = [];

        let refers = [];
        for (let refO of refersO) {
          let ref = getContentByO(refO, items);
          if (ref)
            refers.push(ref);
        }
        this.fields.set(field, refers);
      }
    }
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass;

    this.origin.set("t__status",  this.status);
    this.origin.set("t__color",   this.color);

    for (let [field, value] of this.fields) {
      const isRefList = field.type == FIELD_TYPE_REFERENCE ||
          field.type == FIELD_TYPE_MEDIA && field.isList;

      if (isRefList && value) {
        let refOrigins = [];
        for (let ref of value) {
          if (ref.origin)
            refOrigins.push(ref.origin);
        }
        this.origin.set(field.nameId, refOrigins);
      } else if (field.type == FIELD_TYPE_MEDIA && value) {
        this.origin.set(field.nameId, value.origin);
      } else if (value === undefined) {
        this.origin.unset(field.nameId);
      } else {
        this.origin.set(field.nameId, value);
      }
    }

    this.origin.set("t__model",  this.model.origin);
    if (this.owner)
      this.origin.set("t__owner",  this.owner.origin);
  }

  toJSON(withouStatus = false) {
    const fields = {};
    for (let [field, _value] of this.fields) {
      const {id} = field.origin;
      let value = _value;
      if (value) {
        if ((field.type == FIELD_TYPE_REFERENCE || field.isList) && !value.length)
          continue;

        if (field.type == FIELD_TYPE_REFERENCE) {
          value = value.map(ref => ref.origin.id);
        } else if (field.type == FIELD_TYPE_MEDIA) {
          if (field.isList) {
            value = value.map(media => media.file ? media.file.url() : null);
          } else if (value.file) {
            value = value.file.url();
          }
        }
        fields[id] = value;
      }
    }

    return {
      color:  this.color,
      status: withouStatus ? undefined : this.status,
      fields
    };
  }

  getStringValue(field) {
    const value = this.fields.get(field);
    if (value === undefined)
      return undefined;
    if (!value)
      return '';

    const getElementStringValue = element => {
      if (!element)
        return '';

      if (field.type == FIELD_TYPE_DATE)
        return getTextDate(element);
      if (field.type == FIELD_TYPE_REFERENCE)
        return element.title ? element.title : element.origin.id;
      if (field.type == FIELD_TYPE_MEDIA)
        return element.name;

      return element.toString();
    };

    if (field.isList || field.type == FIELD_TYPE_REFERENCE)
      return value.map(getElementStringValue).join(',\n');
    else
      return getElementStringValue(value);
  }
}
