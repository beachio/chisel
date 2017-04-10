import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {update} from 'ducks/user';
import {currentServerURL, changeServerURL} from 'utils/initialize';

import styles from './UserProfile.sss';


@CSSModules(styles, {allowMultiple: true})
export class UserProfile extends Component  {
  state = {
    firstName: '',
    lastName: '',
    dirtyData: false,
    
    email: '',
    dirtyEmail: false,
    
    serverURL: '',
    dirtyServer: false,
    
    error: null
  };
  userData = null;
  
  
  componentWillMount() {
    const {user} = this.props;
    
    this.userData = user.userData;
    this.setState({
      firstName: user.userData.firstName,
      lastName: user.userData.lastName,
      
      email: user.email,
      
      serverURL: currentServerURL
    });
  }
  
  onSaveData = e => {
    e.preventDefault();
    
    if (this.validate()) {
      this.setState({dirtyData: false});
      
      this.userData.firstName = this.state.firstName;
      this.userData.lastName = this.state.lastName;
      
      const {update} = this.props.userActions;
      update(this.userData);
    }
  };
  
  onSaveEmail = e => {
    e.preventDefault();
    
    if (this.validate()) {
      this.setState({dirtyEmail: false});
      
      this.userData.email = this.state.email;
      
      const {update} = this.props.userActions;
      update(this.userData);
    }
  };
  
  onSaveServer = e => {
    e.preventDefault();
    
    if (this.validate()) {
      this.setState({dirtyServer: false});
      
      changeServerURL(this.state.serverURL);
    }
  };
  
  validate() {
    return true;
  }
  
  onChangeFirstName = event => {
    let firstName = event.target.value;
    this.setState({firstName, dirtyData: true, error: null});
  };
  
  onChangeLastName = event => {
    let lastName = event.target.value;
    this.setState({lastName, dirtyData: true, error: null});
  };
  
  onChangeEmail = event => {
    let email = event.target.value;
    this.setState({email, dirtyEmail: true, error: null});
  };
  
  onChangeServerURL = event => {
    let serverURL = event.target.value;
    this.setState({serverURL, dirtyServer: true, error: null});
  };
  
  render() {
    return (
      <div className="mainArea">
        <Helmet>
          <title>User profile - Chisel</title>
        </Helmet>
        
        <ContainerComponent title="User profile">
          <div styleName="content">
            
            <form styleName="section" onSubmit={this.onSaveData}>
              <div styleName="section-header">Your personal data</div>
              <div styleName="field">
                <div styleName="field-title">First name</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.firstName}
                                onChange={this.onChangeFirstName} />
                </div>
              </div>
              <div styleName="field">
                <div styleName="field-title">Last name</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.lastName}
                                onChange={this.onChangeLastName} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirtyData || this.state.error}
                               value="Update personal data"/>
              </div>
            </form>
  
            <form styleName="section" onSubmit={this.onSaveEmail}>
              <div styleName="section-header">Your email</div>
              <div styleName="field">
                <div styleName="field-title">Email</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.email}
                                onChange={this.onChangeEmail} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirtyEmail || this.state.error}
                               value="Change email"/>
              </div>
            </form>
  
            <form styleName="section" onSubmit={this.onSaveServer}>
              <div styleName="section-header">Parse server data</div>
              <div styleName="field">
                <div styleName="field-title">Server URL</div>
                <div styleName="input-wrapper">
                  <InputControl type="big"
                                value={this.state.serverURL}
                                onChange={this.onChangeServerURL} />
                </div>
              </div>
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirtyServer || this.state.error}
                               value="Update server data"/>
              </div>
            </form>
            
            {
              this.state.error &&
                <div styleName="field-error">
                  {this.state.error}
                </div>
            }
          </div>
        </ContainerComponent>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators({update}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
