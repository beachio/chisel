import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {SiteData} from '../../../models/ModelData';

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  state = {
    sites: [],
    currentSite: null,
    newSite: null
  };
  sitesOld = [];

  componentDidMount() {
    this.setState({sites: this.props.sites});
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({currentSite: nextProps.currentSite});
  }

  onClickSite = site => {
    this.setState({currentSite: site});

    const {setCurrentSite} = this.props;
    setCurrentSite(site);
  };
  
  onClickAdd = () => {
    let site = new SiteData();
    this.sitesOld = this.state.sites;
    
    let newSites = this.state.sites.slice();
    newSites.push(site);
    this.setState({sites: newSites, newSite: site});
  };

  onAddSite = () => {
    const {addSite, sites} = this.props;
    let count = sites.length + 1;

    let site = new SiteData();
    site.name = 'test' + count + '.getforge.io';
    site.domain = site.name;

    addSite(site);
  };

  render() {
    return (
      <div styleName="sites">
        <div styleName="section header">
          <div styleName="title">Your sites</div>
          <div styleName="counter">{this.state.sites.length}/10</div>
        </div>
        <div styleName="section list">
          {
            this.state.sites.map(site => {
              let style = "element";
              if (this.state.currentSite == site)
                style += " element-active";

              return(
                <div styleName={style}
                     onClick={() => this.onClickSite(site)}
                     key={site.name}>
                  <div styleName="icon">
                    <InlineSVG src={require("./hammer.svg")} />
                  </div>
                  <input styleName="site-name"
                         placeholder="Type site name">{site.name}</input>
                  <a href={`http://${site.domain}`} target="_blank">
                    <InlineSVG styleName="link" src={require("./link.svg")} />
                  </a>
                </div>
              );
            })
          }
        </div>
        <div styleName="section new-site" onClick={this.onAddSite}>
          <InlineSVG src={require("./plus.svg")} />
          Add new site
        </div>
      </div>
    );
  }
}
