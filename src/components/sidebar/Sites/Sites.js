import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {MODAL_TYPE_SITE, URL_USERSPACE, URL_PAY_PLANS} from "ducks/nav";
import {withRouter} from "utils/routing";
import {ALERT_TYPE_CONFIRM, ALERT_TYPE_ALERT} from "components/modals/AlertModal/AlertModal";

import styles from './Sites.sss';

import ImageHammer from 'assets/images/hammer.svg';
import ImageIconLink from 'assets/images/icons/link.svg';


@CSSModules(styles, {allowMultiple: true})
export class Sites extends Component {
  state = {sitesLimit: 0};


  static getDerivedStateFromProps(props, state) {
    return {sitesLimit: (props.payPlan ? props.payPlan.limitSites : 0)};
  }

  onClickSite = site => {
    this.props.gotoSite(site);
  };

  onClickAdd = () => {
    const {sites, showPayUpgrade} = this.props;
    const {navigate} = this.props.router;
    const {sitesLimit} = this.state;

    if (sitesLimit && sites.length >= sitesLimit) {
      const options = {
        title: `Warning`,
        type: ALERT_TYPE_ALERT,
        description: `You can't add new site because you have exhausted your limit (${sitesLimit} ${sitesLimit == 1 ? 'site' : 'sites'}).`
      };
      if (showPayUpgrade) {
        options.type = ALERT_TYPE_CONFIRM;
        options.confirmLabel = `Upgrade my account`;
        options.cancelLabel = `Close`;
        options.onConfirm = () => navigate(`/${URL_USERSPACE}/${URL_PAY_PLANS}`);
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
          {this.state.sitesLimit ?
            <div styleName="counter">{sites.length}/{this.state.sitesLimit}</div>
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

                <div styleName="icon-wrapper">
                  {!!site.icon ?
                    <div styleName="icon-img"
                         style={{backgroundImage: `url(${site.icon.url()})`}}>
                    </div>
                  :
                    <InlineSVG src={ImageHammer}/>
                  }
                </div>

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

export default withRouter(Sites);
