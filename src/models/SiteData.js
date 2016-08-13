import {Parse} from 'parse';


export class SiteData {
  OriginClass = Parse.Object.extend("Site");
  origin = null;
  
  domain = "";
  owner = null;
  collaborations = [];

  
  setOrigin(origin) {
    this.origin = origin;

    if (origin.get('domain'))         this.domain         = origin.get('domain');
    if (origin.get('owner'))          this.owner          = origin.get('owner');
    if (origin.get('collaborations')) this.collaborations = origin.get('collaborations');

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