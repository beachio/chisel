import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {SiteData} from 'models/ModelData';
import {MODAL_TYPE_SITE} from "ducks/nav";

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  state = {
    site: null
  };
  
  site = null;
  

  componentWillReceiveProps(nextProps) {
    this.setState({site: nextProps.currentSite});
  }

  onClickSite = site => {
    this.setState({site});
    this.props.gotoSite(site);
  };

  onClickAdd = () => {
    const site = new SiteData();
    this.props.showModal(MODAL_TYPE_SITE, site);
  };

  render() {
    const {sites} = this.props;

    return (
      <div styleName="sites">
        <div styleName="header">
          <div styleName="title">Your sites</div>
          <div styleName="counter">{sites.length}</div>
        </div>
        <div styleName="list">
          {
            sites.map(site => {
              let style = "element";
              if (this.state.site == site)
                style += " element-active";

              const name = site.name;
              const key = sites.indexOf(site);

              return (
                <div styleName={style}
                     onClick={() => this.onClickSite(site)}
                     key={key}>

                  {!!site.icon ?
                    <img styleName="icon-img"
                         src={site.icon.url()}>
                    </img>
                  :
                    <div styleName="icon">
                      <InlineSVG src={require("assets/images/hammer.svg")}/>
                    </div>
                  }

                  <div styleName="site-name">{name}</div>
                  <a href={site.domain} target="_blank" styleName="link">
                    <InlineSVG src={require("assets/images/link.svg")} />
                  </a>
                </div>
              );
            })
          }
        </div>
        <div styleName="new-site" onClick={this.onClickAdd}>
          <InlineSVG src={require("assets/images/plus.svg")} />
          Add new site
        </div>
      </div>
    );
  }
}
