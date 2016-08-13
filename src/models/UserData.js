import {Parse} from 'parse';


export class UserData {
  email = "";
  firstName = "";
  lastName = "";
  avatar = null;
  sex = "male";
  

  init() {
    let origin = Parse.User.current();
    
    if (origin.get('email'))      this.email      = origin.get('email');
    if (origin.get('firstName'))  this.firstName  = origin.get('firstName');
    if (origin.get('lastName'))   this.lastName   = origin.get('lastName');
    if (origin.get('avatar'))     this.avatar     = origin.get('avatar');
    if (origin.get('sex'))        this.sex        = origin.get('sex');

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