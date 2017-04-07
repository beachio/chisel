import {Parse} from 'parse';

import {getContentByO} from 'utils/data';


export const MEDIA_TYPE__IMAGE = "MEDIA_TYPE__IMAGE";

export class MediaItemData {
  static get OriginClass() {return Parse.Object.extend("MediaItem");}
  
  origin = null;
  
  name = '';
  type = MEDIA_TYPE__IMAGE;
  file = null;
  assigned = false;
  
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))     this.name =     origin.get('name');
    if (origin.get('type'))     this.type =     origin.get('type');
    if (origin.get('file'))     this.file =     origin.get('file');
    if (origin.get('assigned')) this.assigned = origin.get('assigned');
  
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new MediaItemData.OriginClass;
    
    this.origin.set("name",     this.name);
    this.origin.set("type",     this.type);
    this.origin.set("file",     this.file);
    this.origin.set("assigned", this.assigned);
  }
  
  clone() {
    let item = new MediaItemData();
    item.file = this.file;
    item.name = this.name;
    item.type = this.type;
    item.assigned = true;
    return item;
  }
}
