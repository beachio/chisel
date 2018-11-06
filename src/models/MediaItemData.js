import {Parse} from 'parse';


export const MEDIA_TYPE__IMAGE = "MEDIA_TYPE__IMAGE";

let keys = [];

export class MediaItemData {
  static get OriginClass() {return Parse.Object.extend("MediaItem");}
  
  origin = null;
  
  name = '';
  type = MEDIA_TYPE__IMAGE;
  size = 0;
  file = null;
  assigned = false;
  
  key = 0;
  
  //links
  site = null;
  
  constructor() {
    while (keys.indexOf(this.key) != -1)
      this.key++;
    keys.push(this.key);
  }
  
  setOrigin(origin) {
    this.origin = origin;
    
    if (origin.get('name'))     this.name     = origin.get('name');
    if (origin.get('type'))     this.type     = origin.get('type');
    if (origin.get('size'))     this.size     = origin.get('size');
    if (origin.get('file'))     this.file     = origin.get('file');
    if (origin.get('assigned')) this.assigned = origin.get('assigned');
  
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new MediaItemData.OriginClass;
    
    this.origin.set("name",     this.name);
    this.origin.set("type",     this.type);
    this.origin.set("size",     this.size);
    this.origin.set("file",     this.file);
    this.origin.set("assigned", this.assigned);
    this.origin.set("site",     this.site.origin);
  }
  
  clone() {
    let item = new MediaItemData();
    item.name     = this.name;
    item.type     = this.type;
    item.size     = this.size;
    item.file     = this.file;
    item.assigned = this.assigned;
    item.site     = this.site;
    return item;
  }
}
