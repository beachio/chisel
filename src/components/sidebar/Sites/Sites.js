import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {SiteData} from '../../../models/SiteData';

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  state = {
    currentSite: null
  };

  componentWillReceiveProps(nextProps) {
    this.setState({currentSite: nextProps.currentSite});
  }

  onClickSite = site => {
    this.setState({currentSite: site});

    const {setCurrentSite} = this.props;
    setCurrentSite(site);
  };

  onAddSite = () => {
    const {addSite, sites} = this.props;
    let count = sites.length + 1;

    let site = new SiteData();
    site.domain = 'test' + count + '.getforge.io';

    addSite(site);
  };

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

              return(
                <div styleName={style}
                     onClick={() => this.onClickSite(site)}
                     key={site.domain}>
                  <div styleName="icon">
                    <InlineSVG src={require("./hammer.svg")} />
                  </div>
                  <div styleName="site-name">{site.domain}</div>
                  <a href="/" target="_blank">
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
