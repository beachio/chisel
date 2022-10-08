import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {NavLink} from "react-router-dom";

import {URL_USERSPACE, URL_SITE, URL_MODELS, URL_CONTENT, URL_MEDIA, URL_API, URL_SETTINGS, URL_SHARING} from 'ducks/nav';
import {throttle} from 'utils/common';
import {withRouter} from "utils/routing";

import styles from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
class Menu extends Component  {
  state = {
    isSidebarOpened: true
  };

  menuRef;
  caretRef;


  componentDidMount() {
    this.calcCaretPos();
    window.addEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSidebarOpened !== this.props.isSidebarOpened) {
      this.caretRef.style = `opacity: 0;`;
      setTimeout(this.calcCaretPos, 200);
    } else {
      this.calcCaretPos();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  calcCaretPos = () => {
    if (!this.caretRef)
      return;

    const {siteNameId} = this.props;
    if (!siteNameId) {
      this.caretRef.style = 'visibility: hidden';
      return;
    }

    const input = this.menuRef.getElementsByClassName(styles.activeItem)[0];

    if (input) {
      const l = input.offsetLeft;
      const w = input.offsetWidth;
      this.caretRef.style = `opacity: 1; transform: translateX(${l}px); width: ${w}px;`;
    } else {
      this.caretRef.style = 'opacity: 0';
    }
  };

  onResize = () => {
    throttle(this.calcCaretPos, 500)();
  };

  render() {
    const {siteNameId} = this.props;
    
    const prefix = `/${URL_USERSPACE}/${URL_SITE}${siteNameId}/`;

    let buttonStyle = "button";
    if (!siteNameId)
      buttonStyle += " button-disabled";

    const {location} = this.props.router;
    const isModels = location.pathname.indexOf(URL_MODELS) != -1;
    const isContent = location.pathname.indexOf(URL_CONTENT) != -1;
    const isMedia = location.pathname.indexOf(URL_MEDIA) != -1;
    const isAPI = location.pathname.indexOf(URL_API) != -1;
    const isSharing = location.pathname.indexOf(URL_SHARING) != -1;
    const isSettings = location.pathname.indexOf(URL_SETTINGS) != -1;

    return (
      <div styleName="menu"
           ref={el => this.menuRef = el}>
        <NavLink to={prefix + URL_MODELS}
                 styleName={buttonStyle}
                 className={isModels ? styles.activeItem : ""}>
          Models
        </NavLink>
        <NavLink to={prefix + URL_CONTENT}
                 styleName={buttonStyle}
                 className={isContent ? styles.activeItem : ""}>
          Content
        </NavLink>
        <NavLink to={prefix + URL_MEDIA}
                 styleName={buttonStyle}
                 className={isMedia ? styles.activeItem : ""}>
          Media
        </NavLink>
        <NavLink to={prefix + URL_API}
                 styleName={buttonStyle}
                 className={isAPI ? styles.activeItem : ""}>
          API
        </NavLink>
        <NavLink to={prefix + URL_SHARING}
                 styleName={buttonStyle}
                 className={isSharing ? styles.activeItem : ""}>
          Sharing
        </NavLink>
        <NavLink to={prefix + URL_SETTINGS}
                 styleName={buttonStyle}
                 className={isSettings ? styles.activeItem : ""}>
          Settings
        </NavLink>

        <div styleName="caret" ref={el => this.caretRef = el} />
      </div>
    );
  }
}

export default withRouter(Menu);