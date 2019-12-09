import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {browserHistory} from "react-router";

import {MODAL_TYPE_SITE, URL_USERSPACE, URL_PAY_PLANS} from "ducks/nav";
import {ALERT_TYPE_CONFIRM, ALERT_TYPE_ALERT} from "components/modals/AlertModal/AlertModal";

import styles from './Sites.sss';

import ImageHammer from 'assets/images/hammer.svg';
import ImageIconLink from 'assets/images/icons/link.svg';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  sitesLimit = 0;


  componentWillReceiveProps(nextProps) {
    this.sitesLimit = nextProps.payPlan ? nextProps.payPlan.limitSites : 0;
  }

  onClickSite = site => {
    this.props.gotoSite(site);
  };

  onClickAdd = () => {
    const {sites, showPayUpgrade} = this.props;
    if (this.sitesLimit && sites.length >= this.sitesLimit) {
      const options = {
        title: `Warning`,
        type: ALERT_TYPE_ALERT,
        description: `You can't add new site because you have exhausted your limit (${this.sitesLimit} ${this.sitesLimit == 1 ? 'site' : 'sites'}).`
      };
      if (showPayUpgrade) {
        options.type = ALERT_TYPE_CONFIRM;
        options.confirmLabel = `Upgrade my account`;
        options.cancelLabel = `Close`;
        options.onConfirm = () => browserHistory.push(`/${URL_USERSPACE}/${URL_PAY_PLANS}`);
      }
      this.props.showAlert(options);
    } else {
      this.props.showModal(MODAL_TYPE_SITE);
    }
  };

  render() {
    const {sites} = this.props;

    return (
      <div styleName="sites">
        <div styleName="header">
          <div styleName="title">Your sites</div>
          {this.sitesLimit ?
            <div styleName="counter">{sites.length}/{this.sitesLimit}</div>
          :
            <div styleName="counter">{sites.length}</div>
          }
        </div>
        <div styleName="list">
          {sites.map(site => {
            let style = "element";
            if (this.props.currentSite == site)
              style += " element-active";

            return (
              <div styleName={style}
                   onClick={() => this.onClickSite(site)}
                   key={site.origin.id ? site.origin.id : Math.random()}>

                {!!site.icon ?
                  <img styleName="icon-img"
                       src={site.icon.url()}>
                  </img>
                :
                  <div styleName="icon">
                     <InlineSVG src={ImageHammer}/>
                  </div>
                }

                <div styleName="site-name">{site.name}</div>
                {!!site.domain ?
                  <a href={site.domain}
                     target="_blank"
                     styleName="link">
                    <InlineSVG src={ImageIconLink}/>
                  </a>
                :
                  <div styleName="link-disabled">
                    <InlineSVG src={ImageIconLink}/>
                  </div>
                }
              </div>
            );
          })}
        </div>
        <div styleName="new-site" onClick={this.onClickAdd}>
          Create New Site
        </div>
      </div>
    );
  }
}
