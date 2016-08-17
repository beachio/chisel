import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {SiteData} from '../../../models/ModelData';
import {checkSiteName} from 'ducks/models';

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  state = {
    currentSite: null,
    adding: false,
    editing: false,
    newSite: null
  };


  componentWillReceiveProps(nextProps) {
    this.setState({currentSite: nextProps.currentSite});
  }

  onClickSite = site => {
    this.setState({currentSite: site});

    const {setCurrentSite} = this.props;
    setCurrentSite(site);
  };

  onClickAdd = () => {
    if (this.state.adding)
      return;

    this.setState({adding: true, newSite: new SiteData()});
  };

  onSiteNameChange = event => {
    let newSite = this.state.newSite;
    if (newSite) {
      let str = event.target.value;
      newSite.name = str;
      this.setState({newSite});
    }
  };

  onSiteNameBlur = () => {
    this.onAddOrChangeSite();
  };

  onKeyPress = target => {
    //Enter pressed
    if (target.charCode == 13) {
      this.onAddOrChangeSite();
    //Esc pressed
    } else if (target.charCode == 27) {
      this.setState({adding: false, newSite: null});
    }
  };

  onAddOrChangeSite() {
    if (this.state.newSite && this.state.newSite.name) {
      let newSite = this.state.newSite;
      newSite.domain = newSite.name;

      if (checkSiteName(this.state.newSite.name)) {
        if (this.state.adding) {
          const {addSite} = this.props;
          addSite(newSite);
        } else if (this.state.editing) {
          const {updateSite} = this.props;
          updateSite(newSite);
        }
        this.setState({adding: false, editing: false, newSite: null});
      } else {
        const {showAlert} = this.props;
        let params = {
          title: "Warning",
          description: "This name is already using. Please, select another one.",
          buttonText: "OK"
        };
        showAlert(params);
      }
    }
  }

  onDoubleClickSite(event, site) {
    this.setState({editing: true, newSite: site});
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

              let editing = !!this.state.newSite && site == this.state.newSite;

              let key = site.origin && site.origin.id ? site.origin.id : Math.random();

              return(
                <div styleName={style}
                     onClick={() => this.onClickSite(site)}
                     key={key}>
                  <div styleName="icon">
                    <InlineSVG src={require("./hammer.svg")} />
                  </div>
                  <input styleName="site-name"
                         readOnly={!editing}
                         autoFocus={editing}
                         onDoubleClick={event => this.onDoubleClickSite(event, site)}
                         placeholder="Type site name"
                         value={site.name}
                         onBlur={this.onSiteNameBlur}
                         onChange={this.onSiteNameChange}
                         onKeyPress={this.onKeyPress} />
                  <a href={`http://${site.domain}`} target="_blank">
                    <InlineSVG styleName="link" src={require("./link.svg")} />
                  </a>
                </div>
              );
            })
          }
          {
            this.state.adding &&
              <div styleName="element">
                <input styleName="site-name"
                       value={this.state.newSite.name}
                       placeholder="Type site name"
                       autoFocus={true}
                       onBlur={this.onSiteNameBlur}
                       onChange={this.onSiteNameChange}
                       onKeyPress={this.onKeyPress}/>
              </div>
          }
        </div>
        <div styleName="section new-site" onClick={this.onClickAdd}>
          <InlineSVG src={require("./plus.svg")} />
          Add new site
        </div>
      </div>
    );
  }
}
