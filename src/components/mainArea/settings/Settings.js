import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {checkSiteName, checkSiteDomain, DOMAIN_ERROR_EXIST, DOMAIN_ERROR_SYNTAX} from 'utils/data';
import {ALERT_TYPE_CONFIRM} from 'components/modals/AlertModal/AlertModal';


import styles from './Settings.sss';

const ERROR_BLANK_NAME = "The name is required!";
const ERROR_URL_SYNTAX  = "The domain URL is wrong!";
const ERROR_NAME_EXIST = "This name is already exists";
const ERROR_URL_EXIST  = "This domain URL is already exists";


@CSSModules(styles, {allowMultiple: true})
export default class Settings extends Component {
  state = {
    name: '',
    domain: '',
    dirty: false,
    error: null
  };
  site = null;
  
  
  constructor(props) {
    super(props);
    
    this.site = props.site;
    
    this.state.name   = this.site.name;
    this.state.domain = this.site.domain;
  }
  
  componentWillReceiveProps(nextProps) {
    this.site = nextProps.site;
    this.setState({
      name: this.site.name,
      domain: this.site.domain
    });
  }
  
  onChangeName = event => {
    let name = event.target.value;
    this.setState({name, dirty: true, error: null});
  };
  
  onChangeDomain = event => {
    let domain = event.target.value;
    this.setState({domain, dirty: true, error: null});
  };
  
  validate() {
    if (!this.state.name) {
      this.setState({error: ERROR_BLANK_NAME});
      return false;
    }
    
    let domainStatus = checkSiteDomain(this.state.domain);
    if (domainStatus == DOMAIN_ERROR_SYNTAX) {
      this.setState({error: ERROR_URL_SYNTAX});
      return false;
    } else if (domainStatus == DOMAIN_ERROR_EXIST) {
      this.setState({error: ERROR_URL_EXIST});
      return false;
    }
    
    if (checkSiteName(this.state.name, this.site)) {
      this.setState({error: ERROR_NAME_EXIST});
      return false;
    }
    
    this.setState({error: null});
    return true;
  }
  
  onSave = e => {
    e.preventDefault();
    if (this.validate()) {
      this.setState({dirty: false});
      this.site.name = this.state.name;
      this.site.domain = this.state.domain;
      this.props.updateSite(this.site);
    }
  };
  
  onDelete = () => {
    const {showAlert, deleteSite} = this.props;
  
    let params = {
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting ${this.state.name}`,
      description: "You are trying to remove the site with all content. This action cannot be undone. Are you sure?<br><br>Please, type site name to confirm:",
      confirmString: this.site.name,
      onConfirm: () => deleteSite(this.site)
    };
    showAlert(params);
  };
  
  render() {
    const {isEditable} = this.props;
    
    return (
      <ContainerComponent title="Site settings">
        <form styleName="content" onSubmit={this.onSave}>
          <div styleName="field">
            <div styleName="field-title">Site name</div>
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.state.name}
                            readOnly={!isEditable}
                            onChange={this.onChangeName} />
            </div>
          </div>
          <div styleName="field">
            <div styleName="field-title">Site domain URL</div>
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.state.domain}
                            readOnly={!isEditable}
                            onChange={this.onChangeDomain} />
            </div>
          </div>
          <div styleName="field">
            <div styleName="field-title">Site ID</div>
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.site.origin.id}
                            readOnly={true} />
            </div>
          </div>
          {
            isEditable &&
              <div styleName="buttons-wrapper">
                <ButtonControl color="green"
                               type="submit"
                               disabled={!this.state.dirty || this.state.error}
                               value="Save changes"/>
              </div>
          }
          {
            isEditable &&
              <div styleName="buttons-wrapper">
                <ButtonControl color="red"
                               value="Delete site"
                               onClick={this.onDelete} />
              </div>
          }
          {
            this.state.error &&
              <div styleName="field-error">
                {this.state.error}
              </div>
          }
        </form>
      </ContainerComponent>
    );
  }
}