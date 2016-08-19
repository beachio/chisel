import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {ModelFieldData} from 'models/ModelData';
import {checkFieldName} from 'ducks/models';
import {MODAL_TYPE_FIELD} from 'ducks/nav';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  state = {
    fields: [],
    fieldName: "",
    jsonVisibility: false
  };
  activeInput = null;


  componentWillMount() {
    this.setState({fields: this.props.model.fields});
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.activeInput)
      this.activeInput.focus();
    this.setState({fields: nextProps.model.fields});
  }

  onFieldNameChange = event => {
    let name = event.target.value;
    this.setState({fieldName: name});
  };

  onKeyDown = event => {
    if (this.props.modalShowing || this.props.alertShowing)
      return;
    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddField();
      //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({fieldName: ""});
    }
  };

  onAddField = event => {
    if (event)
      event.preventDefault();

    if (!this.state.fieldName)
      return;

    if (!checkFieldName(this.state.fieldName)) {
      const {showAlert} = this.props;
      let params = {
        title: "Warning",
        description: "This name is already using. Please, select another one.",
        buttonText: "OK"
      };
      showAlert(params);
      return;
    }

    const {addField} = this.props;

    let field = new ModelFieldData();
    field.name = this.state.fieldName;

    let red   = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue  = Math.floor(Math.random() * 256);
    field.color = `rgba(${red}, ${green}, ${blue}, 1)`;

    addField(field);

    this.setState({fieldName: ""});
  };

  onFieldClick = field => {
    const {showModal} = this.props;
    showModal(MODAL_TYPE_FIELD, field);
  };

  onJSONClick = () => {
    this.setState({
      jsonVisibility: !this.state.jsonVisibility
    });
  };

  render() {
    const {model, onClose} = this.props;

    let content;
    if (this.state.jsonVisibility) {
      content = (
        <pre styleName="json-wrapper">
          {`
            {
              "notification": {
                "today_you": "Today you achieved",
                "percent": "% of your planned medications.",
                "please_remember": "Please remember to take your",
                "minutes": "in 30 minutes.",
                "now_time": "It's now time to take your",
                "missed": "You've missed your scheduled"
              },
              "gender": {
                "sex": "Sex",
                "male": "Male",
                "female": "Female"
              },
              "pharmacy": {
                "title": "Your pharmacy",
                "open_until": "Open until",
                "now_closed": "Now closed",
                "next_opening": "Next opening",
                "description_title": "Description",
                "timetables_title": "Timetables",
                "timetables_opening_subtitle": "Opening",
                "monday": "Monday",
                "tuesday": "Tuesday",
                "wednesday": "Wednesday",
                "thursday": "Thursday",
                "friday": "Friday",
                "saturday": "Saturday",
                "sunday": "Sunday",
                "contact_title": "Contacts",
                "map_title": "Maps",
                "call": "call",
                "email": "email",
                "map": "map",
                "closed": "closed"
              },
              "login": {
                "with_facebook": "Login with Facebook",
                "forgot_password": "Forgot password?",
                "dont_have_account": "You do not have an account?",
                "register": "Register",
                "or": "or",
                "wrong": "Wrong email or password"
              },
              "forgot_password": {
                "title": "Forgot password",
                "send_password": "Send Password",
                "dont_have_account": "You do not have an account?",
                "register": "Register",
                "type_email_correctly": "Please, type your email correctly",
                "no_account": "There is no account linked with this email",
                "mail_with_link": "A reset link has been sent to this email."
              },
              "registration_1": {
                "dont_know_code": "I do not know the code. How can I get it?",
                "continue": "Continue",
                "pharmacy_code": "Pharmacy code",
                "no_pharmacy": "There is no associated pharmacy",
                "choose_city": "Your City",
                "choose_pharmacy": "Your Pharmacy"
              },
              "registration_2": {
                "title": "Registration",
                "or": "or",
                "with_facebook": "Register with Facebook",
                "continue": "Continue",
                "confirm": "Confirm Password",
                "legal_privacy": "I accept the terms of service",
                "auth": "I accept the privacy policy",
                "exist": "This email already exists",
                "legals": "Please, confirm legals",
                "identical": "Passwords are not identical"
              },
              "registration_3": {
                "title": "Registration",
                "name": "Name",
                "surname": "Surname",
                "birthday": "Birthday",
                "phone": "Phone",
                "register": "Register"
              },
              "slides": {
                "register": "Register"
              },
              "contacts": {
                "title": "Choose who to contact"
              },
              "contact_form": {
                "title": "Contact us",
                "copy": "Send copy to my email",
                "send_message": "Send message",
                "my_message": "This is my message",
                "message_title": "Message",
                "subject": "Subject",
                "subject_placeholder": "Enter your message subject",
                "to": "To",
                "pharmacist_placeholder": "The name of your pharmacist, if known"
              },
              "mail_confirm": {
                "compliments": "Congratulations!",
                "sended": "Your message has been sent!"
              },
              "promo": {
                "title": "Promotion",
                "promo_tab": "Promotion",
                "wishlist_tab": "Wishlist"
              },
              "promo_details": {
                "title": "Details promotion",
                "save": "Save",
                "redeem": "Redeem"
              },
              "services": {
                "title": "Services",
                "services_tab": "Services",
                "booking_tab": "Booking",
                "request": "Request sent on"
              },
              "service_details": {
                "title": "Details service",
                "request": "Request sent on"
              },
              "service-welcome": {
                "heading": "Services",
                "title": "Book an Appointment",
                "text": "Browse the services we offer and click '+' to book an appointment.",
                "button": "OK"
              },
              "service-confirm": {
                "title": "Thanks for booking!",
                "text": "You will receive an email from your pharmacist to arrange the appointment day and time."
              },
              "profile": {
                "title": "Profile",
                "anagraphy": "Anagraphy",
                "contact": "Contact",
                "pharmacy_code": "Pharmacy code",
                "meal_times": "Meal times",
                "morning": "this is when you habitually eat your breakfast",
                "noon": "this is when you habitually eat your lunch",
                "evening": "this is when you habitually eat your dinner",
                "night": "this is when you habitually sleep",
                "save": "Save changes",
                "compliments": "Congratulations!",
                "confirm": "Your profile has been saved!"
              },
              "icare": {
                "title": "I-Care",
                "hello": "Hello",
                "your_lifestyle": "Your lifestyle",
                "last_checkup": "Last checkup"
              },
              "icare_details": {
                "title": "Checkup details",
                "view_report_link": "View report for more info",
                "next_appoint": "Next appoint.",
                "view_report": "View report"
              },
              "reminder-welcome": {
                "title": "Welcome",
                "welcome": "Welcome!",
                "here_you_can": "Here you can create",
                "your_reminder": "your reminder that alerts",
                "whenever": "you whenever you will need",
                "take_medicine": "to take medicine",
                "helping": "Helping you take care of yourself.",
                "set_meal": "Set meal times",
                "later": "I'll do later from my profile"
              },
              "reminder-confirm": {
                "compliments": "Congratulations!",
                "your_reminder": "Your reminder has been set!",
                "your_reminder_updated": "Your reminder has been updated!",
                "your_reminder_deleted": "Your reminder has been deleted!"
              },
              "reminder-details": {
                "title": "Details reminder"
              },
              "reminders": {
                "title": "Reminders",
                "create_new": "Create new reminder",
                "sure-delete": "Are you sure to delete reminder?",
                "cancel": "Cancel",
                "delete": "Delete"
              },
              "new-reminder": {
                "title": "New reminder",
                "name_product": "Name of product",
                "edit": "Edit",
                "medicine": "Medicine",
                "morning": "Morning",
                "noon": "Noon",
                "evening": "Evening",
                "night": "Night",
                "frequency": "Frequency",
                "add_program": "Add program",
                "every": "Every",
                "dosage_type": "Dosage type",
                "cancel": "Cancel",
                "save": "Save",
                "save_reminder": "Save reminder",
                "duration": "Duration",
                "edit_reminder": "Edit reminder",
                "delete_reminder": "Delete reminder",
                "days": "days",
                "weeks": "weeks",
                "months": "months",
                "pill": "pill",
                "tablet": "tablet",
                "capsule": "capsule",
                "tablespoon": "tablespoon",
                "teaspoon": "teaspoon",
                "mililitre": "mililitre",
                "litre": "litre",
                "gram": "gram",
                "lifetime": "Lifetime",
                "dicard": "Discard",
                "discard-title": "Are you sure to disacrd your changes?"
              },
              "settings": {
                "title": "Settings",
                "notifications": "Notifications",
                "bluetooth": "Bluetooth",
                "early_warning": "30 Minute Warning",
                "alert_reminder": "Alert Reminder",
                "failure_reminder": "Failure reminder",
                "other": "Other",
                "promo_notify": "Notify Promo",
                "proximity_reminder": "Proximity Reminder"
              },
              "privacy": {
                "title": "Privacy & Legal"
              },
              "app": {
                "set-password": "Set password",
                "password": "Password",
                "confirm-password": "Confirm Password",
                "please-set": "Please, set your new password",
                "save": "Save",
                "are-you-sure": "Are you sure?",
                "logout-message": "Logout message",
                "logout": "Logout",
                "cancel": "Cancel",
                "retry": "Retry",
                "error": "Error!"
              }
            }

          `}
        </pre>
      )
    } else {
      content = (
        <div>
          <div styleName="list">
            {
              this.state.fields.map(field => {
                let colorStyle = {background: field.color};
                let key = field.origin && field.origin.id ? field.origin.id : Math.random();

                return (
                  <div styleName="list-item"
                       key={key}
                       onClick={() => this.onFieldClick(field)}>
                    <div styleName="list-item-color" style={colorStyle}></div>
                    <div styleName="list-item-text">
                      <div styleName="list-item-name">{field.name}</div>
                      <div styleName="list-item-type">{field.type}</div>
                    </div>
                    <div styleName="hidden-controls">
                      <div styleName="hidden-button">TITLE</div>
                      <div styleName="hidden-remove">
                        <InlineSVG styleName="cross"
                                   src={require("./cross.svg")} />
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>

          <div styleName="create-new">
            <input styleName="input"
                   placeholder="Add New Field"
                   value={this.state.fieldName}
                   autoFocus={true}
                   onKeyDown={this.onKeyDown}
                   onChange={this.onFieldNameChange}
                   ref={c => this.activeInput = c} />
            <InlineSVG styleName="plus"
                       src={require("./plus.svg")}
                       onClick={this.onAddField} />
          </div>
        </div>
      );
    }

    return (
      <div className="g-container" styleName="models">
        <div styleName="header">
          <div styleName="back" onClick={onClose}>Back</div>
          <div styleName="header-name">{model.name}</div>
          <div styleName="json-fields" onClick={this.onJSONClick}>
            {this.state.jsonVisibility ? 'Fields' : 'JSON'}
          </div>
          <div styleName="header-description">{model.description}</div>
        </div>
        {content}
      </div>
    );
  }
}
