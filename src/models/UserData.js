import {Parse} from 'parse';


export class UserData {
  origin = null;
  
  email = "";
  emailNew = "";
  firstName = "";
  lastName = "";
  avatar = null;
  sex = "male";
  
  
  setOrigin(origin = Parse.User.current()) {
    this.origin = origin;
    
    if (origin.get('email'))      this.email      = origin.get('email');
      if (!this.email)            this.email      = origin.get('username');
    
    if (origin.get('emailNew'))   this.emailNew   = origin.get('emailNew');
    if (origin.get('firstName'))  this.firstName  = origin.get('firstName');
    if (origin.get('lastName'))   this.lastName   = origin.get('lastName');
    if (origin.get('avatar'))     this.avatar     = origin.get('avatar');
    if (origin.get('sex'))        this.sex        = origin.get('sex');

    return this;
  }

  updateOrigin() {
    this.origin.set("firstName", this.firstName);
    this.origin.set("lastName",  this.lastName);
    this.origin.set("avatar",    this.avatar);
    this.origin.set("sex",       this.sex);
  }
}

export const ROLE_OWNER     = "OWNER";
export const ROLE_ADMIN     = "ADMIN";
export const ROLE_EDITOR    = "EDITOR";
export const ROLE_DEVELOPER = "DEVELOPER";

export class CollaborationData {
  static get OriginClass() {return Parse.Object.extend("Collaboration");}
  
  origin = null;
  
  role = ROLE_DEVELOPER;
  email = '';
  
  //links
  site = null;
  user = null;
  
  setOrigin(origin) {
    this.origin = origin;
  
    if (origin.get('role'))   this.role =   origin.get('role');
    if (origin.get('email'))  this.email =  origin.get('email');
    
    return this;
  }
  
  updateOrigin() {
    if (!this.origin)
      this.origin = new CollaborationData.OriginClass();
    
    this.origin.set("role", this.role);
    this.origin.set("email", this.email);
    this.origin.set("site", this.site.origin);
    if (this.user)
      this.origin.set("user", this.user.origin);
  }
}