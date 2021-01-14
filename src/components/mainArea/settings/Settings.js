import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Parse} from 'parse';

import {filterSpecials, checkURL} from 'utils/strings';
import {checkSiteName, checkSiteDomain, DOMAIN_ERROR_EXIST, DOMAIN_ERROR_SYNTAX} from 'utils/data';
import {triggerSiteWebhook} from 'utils/server';
import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import SwitchControl from "components/elements/SwitchControl/SwitchControl";
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import {ALERT_TYPE_CONFIRM} from 'components/modals/AlertModal/AlertModal';

import styles from './Settings.sss';


const ERROR_BLANK_NAME = "The name is required!";
const ERROR_URL_SYNTAX  = "The domain URL is wrong!";
const ERROR_WEBHOOK_SYNTAX  = "The webhook URL is wrong!";
const ERROR_NAME_EXIST = "This name is already exists";
const ERROR_URL_EXIST  = "This domain URL is already exists";


@CSSModules(styles, {allowMultiple: true})
export default class Settings extends Component {
  state = {
    name:             this.props.site.name,
    domain:           this.props.site.domain,
    webhook:          this.props.site.webhook,
    webhookDisabled:  this.props.site.webhookDisabled,
    icon:             this.props.site.icon,

    dirty: false,
    error: null,
    errorFile: null
  };
  
  downloadElm = null;


  onChangeName = name => {
    this.setState({name, dirty: true, error: null});
  };

  onChangeDomain = domain => {
    this.setState({domain, dirty: true, error: null});
  };

  onChangeWebhook = webhook => {
    this.setState({webhook, dirty: true, error: null});
  };

  onChangeWebhookDisabled = webhookDisabled => {
    this.setState({webhookDisabled, dirty: true, error: null});
  };

  onChangeIcon = async event => {
    const file = event.target.files[0];
    if (!file)
      return;

    if (file.type.slice(0, 6) != `image/`) {
      this.setState({errorFile: `You should upload an image!`});
      return;
    }

    if (file.size > 1024 * 1024) {
      this.setState({errorFile: `Your file's size exceeds a limit of 1 MB!`});
      return;
    }

    this.setState({errorFile: null});

    const parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    await parseFile.save();
    this.setState({dirty: true, icon: parseFile});
  };

  onTriggerWebhook = () => {
    const {webhook} = this.state;
    if (!webhook)
      return;

    if (checkURL(webhook))
      triggerSiteWebhook(webhook);
    else
      this.setState({error: ERROR_WEBHOOK_SYNTAX});
  };

  validate() {
    if (!this.state.name) {
      this.setState({error: ERROR_BLANK_NAME});
      return false;
    }

    let domainStatus = checkSiteDomain(this.state.domain, this.props.site);
    if (domainStatus == DOMAIN_ERROR_SYNTAX) {
      this.setState({error: ERROR_URL_SYNTAX});
      return false;
    } else if (domainStatus == DOMAIN_ERROR_EXIST) {
      this.setState({error: ERROR_URL_EXIST});
      return false;
    }

    if (this.state.webhook && !checkURL(this.state.webhook)) {
      this.setState({error: ERROR_WEBHOOK_SYNTAX});
      return false;
    }

    if (checkSiteName(this.state.name, this.props.site)) {
      this.setState({error: ERROR_NAME_EXIST});
      return false;
    }

    this.setState({error: null});
    return true;
  }

  onSave = e => {
    e.preventDefault();

    if (!this.state.dirty || this.state.error || !this.validate())
      return;

    this.setState({dirty: false});

    const {site} = this.props;
    site.name             = this.state.name;
    site.domain           = this.state.domain;
    site.webhook          = this.state.webhook;
    site.webhookDisabled  = this.state.webhookDisabled;
    site.icon             = this.state.icon;
    this.props.updateSite(site);
  };

  onDelete = () => {
    const {showAlert, deleteSite} = this.props;

    let params = {
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting ${this.state.name}`,
      description: "You are trying to remove the site with all content. This action cannot be undone. Are you sure?<br><br>Please, type site name to confirm:",
      confirmString: this.props.site.name,
      onConfirm: () => deleteSite(this.props.site)
    };
    showAlert(params);
  };
  
  onExport = () => {
    const {site} = this.props;
    const json = JSON.stringify(site.models, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    this.downloadElm.setAttribute("href", dataStr);
    this.downloadElm.setAttribute("download", `${filterSpecials(site.name)}.json`);
    this.downloadElm.click();
  };

  getIcon() {
    const {isEditable} = this.props;

    let btnStyle = `icon-button`;
    if (!isEditable)
      btnStyle += ` icon-button-disabled`;

    let icon = null;
    if (this.state.icon)
      icon = (
        <img styleName="icon-img"
          src={this.state.icon.url()}>
        </img>
      );

    return (
      <div styleName="field field-icon">
        <div styleName="field-title">Site Icon</div>
        <div styleName="icon-img__wrapper">
          {icon}
        </div>
        <div styleName="button-wrapper">
          <div styleName={btnStyle + ` icon-upload`}>
            Upload Site Icon
            <input styleName="icon-hidden"
                   type="file"
                   accept="image/jpeg,image/png,image/gif"
                   disabled={!isEditable}
                   onChange={this.onChangeIcon} />
          </div>
        </div>
        {this.state.errorFile &&
          <div styleName="field-error">
            {this.state.errorFile}
          </div>
        }
      </div>
    );
  }

  render() {
    const {isEditable} = this.props;

    return (
      <ContainerComponent title={`${this.state.name} settings`}>
        <form styleName="content" onSubmit={this.onSave}>
          <div styleName="field">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.state.name}
                            label="Site Name"
                            titled
                            readOnly={!isEditable}
                            onChange={this.onChangeName} />
            </div>
          </div>
          <div styleName="field">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.state.domain}
                            label="Site Domain URL"
                            titled
                            readOnly={!isEditable}
                            onChange={this.onChangeDomain} />
            </div>
          </div>
          <div styleName="field">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.state.webhook}
                            titled
                            label="Webhook URL"
                            readOnly={!isEditable}
                            onChange={this.onChangeWebhook} />
            </div>
          </div>
          <div styleName="field">
            <div styleName="input-wrapper">
              <SwitchControl label="Do not trigger webhook automatically"
                             checked={this.state.webhookDisabled}
                             onChange={this.onChangeWebhookDisabled} />
            </div>
          </div>
          <div styleName="field button-wrapper">
            <ButtonControl color="purple"
                           disabled={!this.state.webhook}
                           value="Trigger webhook"
                           onClick={this.onTriggerWebhook} />
          </div>
          <div styleName="field">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            titled
                            label="Site ID"
                            value={this.props.site.origin.id}
                            readOnly={true} />
            </div>
          </div>

          {this.getIcon()}

          <div styleName="buttons">
            {
              isEditable &&
                <div styleName="field button-wrapper">
                  <ButtonControl color="red"
                                 value="Delete Site"
                                 onClick={this.onDelete} />
                </div>
            }
            <div styleName="field button-wrapper button-export">
              <ButtonControl color="black"
                             value="Export Models"
                             onClick={this.onExport} />
            </div>
            {
              isEditable &&
                <div styleName="field button-wrapper">
                  <ButtonControl color= "purple"
                                 type="submit"
                                 disabled={!this.state.dirty || this.state.error}
                                 value="Save Changes"/>
                </div>
            }
            <a style={{display: 'none'}}
               ref={elm => this.downloadElm = elm}>
            </a>
          </div>
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
