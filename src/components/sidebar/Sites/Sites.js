import React, {Component, PropTypes} from 'react';
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
    newSiteName: ""
  };
  
  newSite = null;
  
  inputAdding = null;
  activeInput = null;
  returnFocus = false;


  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.returnFocus) {
      this.returnFocus = false;
      if (this.activeInput)
        this.activeInput.focus();
      else if (this.inputAdding)
        this.inputAdding.focus();
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

    this.newSite = new SiteData();
    this.setState({adding: true});
  };

  onSiteNameChange = event => {
    let newSiteName = event.target.value;
    this.setState({newSiteName});
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
        this.state.newSiteName &&
        this.state.newSiteName != this.newSite.name) {
      
      if (!checkSiteName(this.state.newSiteName, this.state.currentSite)) {
        this.newSite.name = this.state.newSiteName;
        const {addSite, gotoSite, updateSite} = this.props;
        
        if (this.state.adding)
          addSite(this.newSite);
        else if (this.state.editing)
          updateSite(this.newSite);
        
        gotoSite(this.newSite);
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
    this.newSite = null;
    this.activeInput = null;
    this.setState({adding: false, editing: false, newSiteName: ""});
  }

  onDoubleClickSite(event, site) {
    let role = getRole(site);
    if (role != ROLE_OWNER && role != ROLE_ADMIN)
      return;
    
    this.newSite = site;
    this.setState({editing: true, newSiteName: site.name});
  }

  render() {
    const {sites} = this.props;

    return (
      <div styleName="sites">
        <div styleName="section header">
          <div styleName="title">Your sites</div>
          <div styleName="counter">{sites.length}/10</div>
        </div>
        <div styleName="section list">
          {
            sites.map(site => {
              let style = "element";
              if (this.state.currentSite == site)
                style += " element-active";

              let editing = this.state.editing && site == this.newSite;

              let styleInput = "site-name";
              let name = site.name;
              let ref = () => {};
              if (editing) {
                styleInput += " site-name-editable";
                name = this.state.newSiteName;
                ref = c => this.activeInput = c;
              }

              let key = site.origin && site.origin.id ? site.origin.id : Math.random();

              return(
                <div styleName={style}
                     onDoubleClick={event => this.onDoubleClickSite(event, site)}
                     onClick={() => this.onClickSite(site)}
                     key={key}>
                  <div styleName="icon">
                    <InlineSVG src={require("assets/images/hammer.svg")} />
                  </div>
                  <input styleName={styleInput}
                         readOnly={!editing}
                         placeholder="Type site name"
                         value={name}
                         onBlur={this.onSiteNameBlur}
                         onChange={this.onSiteNameChange}
                         onKeyDown={this.onKeyDown}
                         ref={ref} />
                  <a href={`http://${site.domain}`} target="_blank">
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
                       value={this.state.newSiteName}
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
