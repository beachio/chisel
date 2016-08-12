export class UserData {
  email = "";
  firstName = "";
  lastName = "";
  avatar = null;
  sex = "male";

  setFromServer(object) {
    if (object.get('email'))      this.email      = object.get('email');
    if (object.get('firstName'))  this.firstName  = object.get('firstName');
    if (object.get('lastName'))   this.lastName   = object.get('lastName');
    if (object.get('avatar'))     this.avatar     = object.get('avatar');
    if (object.get('sex'))        this.sex        = object.get('sex');

    return this;
  }

  updateRemote(remote) {
    remote.set("firstName", this.firstName);
    remote.set("lastName",  this.lastName);
    remote.set("avatar",    this.avatar);
    remote.set("sex",       this.sex);
  }
}