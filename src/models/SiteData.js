import {Parse} from 'parse';


export class SiteData {
  OriginClass = Parse.Object.extend("Site");
  origin = null;
  objectId = "";
  
  domain = "";
  owner = null;
  collaborations = [];

  
  setOrigin(object) {
    this.origin = object;
    this.objectId = object.id;

    if (object.get('domain'))         this.domain         = object.get('domain');
    if (object.get('owner'))          this.owner          = object.get('owner');
    if (object.get('collaborations')) this.collaborations = object.get('collaborations');

    return this;
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new this.OriginClass();
    
    this.origin.set("domain",         this.domain);
    this.origin.set("owner",          this.owner);
    this.origin.set("collaborations", this.collaborations);
  }
}