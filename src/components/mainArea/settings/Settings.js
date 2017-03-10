import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {checkSiteName, checkSiteDomain} from 'utils/data';


import styles from './Settings.sss';

const ERROR_BLANK_NAME = "The name is required!";
const ERROR_WRONG_URL  = "The domain URL is wrong!";
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
  
  
  componentWillMount() {
    this.site = this.props.site;
    this.setState({
      name: this.site.name,
      domain: this.site.domain
    });
  }
  
  componentWillReceiveProps(nextProps) {
    this.site = nextProps.site;
    this.setState({
      name: this.site.name,
      domain: this.site.domain
    });
  }
  
  componentWillUnmount() {
    
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
    
    //TODO: move to utils
    let pattern = new RegExp('^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!pattern.test(this.state.domain)) {
      this.setState({error: ERROR_WRONG_URL});
      return false;
    }
    
    if (!checkSiteName(this.state.name, this.site)) {
      this.setState({error: ERROR_NAME_EXIST});
      return false;
    }
    
    if (!checkSiteDomain(this.state.domain, this.site)) {
      this.setState({error: ERROR_URL_EXIST});
      return false;
    }
    
    this.setState({error: null});
    return true;
  }
  
  onSave = () => {
    if (this.validate()) {
      this.setState({dirty: false});
      this.site.name = this.state.name;
      this.site.domain = this.state.domain;
      this.props.updateSite(this.site);
    }
  };
  
  render() {
    const {isEditable} = this.props;
    
    return (
      <ContainerComponent title="Site settings">
        <div styleName="content">
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
          {
            isEditable &&
            <div styleName="buttons-wrapper">
              <ButtonControl color="green"
                             disabled={!this.state.dirty || this.state.error}
                             value="Save changes"
                             onClick={this.onSave}/>
            </div>
          }
          {
            this.state.error &&
              <div styleName="field-error">
                {this.state.error}
              </div>
          }
        </div>
      </ContainerComponent>
    );
  }
}