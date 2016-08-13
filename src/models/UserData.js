import {Parse} from 'parse';


export class UserData {
  email = "";
  firstName = "";
  lastName = "";
  avatar = null;
  sex = "male";
  

  init() {
    let object = Parse.User.current();
    
    if (object.get('email'))      this.email      = object.get('email');
    if (object.get('firstName'))  this.firstName  = object.get('firstName');
    if (object.get('lastName'))   this.lastName   = object.get('lastName');
    if (object.get('avatar'))     this.avatar     = object.get('avatar');
    if (object.get('sex'))        this.sex        = object.get('sex');

    return this;
  }

  updateOrigin() {
    let origin = Parse.User.current();
  
    origin.set("firstName", this.firstName);
    origin.set("lastName",  this.lastName);
    origin.set("avatar",    this.avatar);
    origin.set("sex",       this.sex);
  }
}