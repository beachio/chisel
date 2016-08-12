export class SiteData {
  objectId = "";
  domain = "";
  owner = null;
  collaborations = [];

  setFromServer(object) {
    this.objectId = object.id;

    if (object.get('domain'))         this.domain         = object.get('domain');
    if (object.get('owner'))          this.owner          = object.get('owner');
    if (object.get('collaborations')) this.collaborations = object.get('collaborations');

    return this;
  }

  updateRemote(remote) {
    remote.set("domain",          this.domain);
    remote.set("owner",           this.owner);
    remote.set("collaborations",  this.collaborations);
  }
}