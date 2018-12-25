import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {browserHistory} from "react-router";

import {MODAL_TYPE_SITE, URL_USERSPACE, URL_PAY_PLANS} from "ducks/nav";
import {ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";

import styles from './Sites.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sites extends Component {
  state = {
    site: null
  };
  
  sitesLimit = 0;
  

  constructor(props) {
    super(props);
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({site: nextProps.currentSite});
  
    const {payPlan} = nextProps;
    this.sitesLimit = payPlan ? payPlan.limitSites : 0;
  }

  onClickSite = site => {
    this.setState({site});
    this.props.gotoSite(site);
  };

  onClickAdd = () => {
    const {sites} = this.props;
    if (this.sitesLimit && sites.length >= this.sitesLimit)
      this.props.showAlert({
        title: `Warinng`,
        type: ALERT_TYPE_CONFIRM,
        description: `You can't add new site because you have exhausted your limit (${this.sitesLimit}).`,
        confirmLabel: `Upgrade my account`,
        cancelLabel: `Close`,
        onConfirm: () => browserHistory.push(`/${URL_USERSPACE}/${URL_PAY_PLANS}`)
      });
    else
      this.props.showModal(MODAL_TYPE_SITE);
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
                  {!!site.domain ?
                    <a href={site.domain}
                       target="_blank"
                       styleName="link">
                      <InlineSVG src={require("assets/images/link.svg")}/>
                    </a>
                  :
                    <div styleName="link-disabled">
                      <InlineSVG src={require("assets/images/link.svg")}/>
                    </div>
                  }
                </div>
              );
            })
          }
        </div>
        <div styleName="new-site" onClick={this.onClickAdd}>
          Create a new site
        </div>
      </div>
    );
  }
}
