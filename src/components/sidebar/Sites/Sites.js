import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {SiteData} from 'models/ModelData';
import {checkSiteName, getRole} from 'utils/data';
import {ROLE_OWNER, ROLE_ADMIN} from 'models/UserData';

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  state = {
    currentSite: null,
    adding: false,
    editing: false,
    siteName: ""
  };
  
  site = null;
  
  inputAdding = null;
  activeInput = null;
  returnFocus = false;


  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.returnFocus) {
      this.returnFocus = false;
      if (this.activeInput)
        setTimeout(() => this.activeInput.focus(), 1);
      else if (this.inputAdding)
        setTimeout(() => this.inputAdding.focus(), 1);
    }
    this.setState({currentSite: nextProps.currentSite});
  }

  onClickSite = site => {
    if (this.state.adding || this.state.editing)
      return;

    const {gotoSite} = this.props;
    gotoSite(site);
    
    this.setState({currentSite: site});
  };

  onClickAdd = () => {
    if (this.state.adding)
      return;

    this.site = new SiteData();
    this.setState({adding: true});
  };

  onSiteNameChange = event => {
    let siteName = event.target.value;
    this.setState({siteName});
  };

  onSiteNameBlur = () => {
    this.onAddOrUpdateSite(true);
  };

  onKeyDown = event => {
    if (this.props.alertShowing)
      return;

    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddOrUpdateSite();
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.endEdit();
    }
  };

  onAddOrUpdateSite(endOnSameName) {
    if ((this.state.adding || this.state.editing) &&
        this.state.siteName &&
        this.state.siteName != this.site.name) {
      
      if (!checkSiteName(this.state.siteName)) {
        this.site.name = this.state.siteName;
        const {addSite, gotoSite, updateSite} = this.props;
        
        if (this.state.adding)
          addSite(this.site);
        else if (this.state.editing)
          updateSite(this.site);
        
        gotoSite(this.site);
        this.endEdit();
      
      } else {
        if (endOnSameName && !this.props.alertShowing) {
          this.endEdit();
        } else {
          const {showAlert} = this.props;
          let params = {
            title: "Warning",
            description: "This name is already using. Please, select another one.",
            buttonText: "OK"
          };
          showAlert(params);
          this.returnFocus = true;
        }
      }
      
    } else {
      this.endEdit();
    }
  }

  endEdit() {
    this.site = null;
    this.activeInput = null;
    this.setState({adding: false, editing: false, siteName: ""});
  }

  onDoubleClickSite(event, site) {
    let role = getRole(site);
    if (role != ROLE_OWNER && role != ROLE_ADMIN)
      return;
    
    this.site = site;
    this.setState({editing: true, siteName: site.name});
  }

  render() {
    const {sites} = this.props;

    return (
      <div styleName="sites">
        <div styleName="section header">
          <div styleName="title">Your sites</div>
          <div styleName="counter">{sites.length}</div>
        </div>
        <div styleName="section list">
          {
            sites.map(site => {
              let style = "element";
              if (this.state.currentSite == site)
                style += " element-active";

              let editing = this.state.editing && site == this.site;

              let styleInput = "site-name";
              let name = site.name;
              let ref = () => {};
              if (editing) {
                styleInput += " site-name-editable";
                name = this.state.siteName;
                ref = c => this.activeInput = c;
              }

              let key = site.origin && site.origin.id ? site.origin.id : Math.random();

              return(
                <div styleName={style}
                     onDoubleClick={event => this.onDoubleClickSite(event, site)}
                     onClick={() => this.onClickSite(site)}
                     key={key}>

                  {
                    !!site.icon ?
                      <img styleName="icon-img"
                           src={site.icon.url()}>
                      </img>
                      :
                      <div styleName="icon">
                        <InlineSVG src={require("assets/images/hammer.svg")}/>
                      </div>
                  }

                  <input styleName={styleInput}
                         readOnly={!editing}
                         placeholder="Type site name"
                         value={name}
                         onBlur={this.onSiteNameBlur}
                         onChange={this.onSiteNameChange}
                         onKeyDown={this.onKeyDown}
                         ref={ref} />
                  <a href={site.domain} target="_blank">
                    <InlineSVG styleName="link" src={require("assets/images/link.svg")} />
                  </a>
                </div>
              );
            })
          }
          {
            this.state.adding &&
              <div styleName="element">
                <input styleName="site-name"
                       value={this.state.siteName}
                       placeholder="Type site name"
                       autoFocus={true}
                       onBlur={this.onSiteNameBlur}
                       onChange={this.onSiteNameChange}
                       onKeyDown={this.onKeyDown}
                       ref={c => this.inputAdding = c} />
              </div>
          }
        </div>
        {
          !this.state.adding &&
            <div styleName="section new-site" onClick={this.onClickAdd}>
              <InlineSVG src={require("assets/images/plus.svg")} />
              Add new site
            </div>
        }
      </div>
    );
  }
}
