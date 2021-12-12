import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link, NavLink} from 'react-router-dom';

import {PAGE_MODELS, PAGE_MODELS_ITEM, PAGE_CONTENT, PAGE_CONTENT_ITEM, PAGE_API, PAGE_SETTINGS, PAGE_SHARING,
  URL_USERSPACE, URL_SITE, URL_MODELS, URL_CONTENT, URL_API, URL_SETTINGS, URL_SHARING} from 'ducks/nav';
import {throttle} from 'utils/common';

import styles from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
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
    if (prevProps.isSidebarOpened !== this.props.isSidebarOpened)
      setTimeout(this.calcCaretPos, 200);
    else
      this.calcCaretPos();
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

    return (
      <div styleName="menu"
           ref={el => this.menuRef = el}>

        <NavLink to={prefix + URL_MODELS}
                 styleName={buttonStyle}
                 className={({ isActive }) => (isActive ? styles.activeItem : "")}>
          Models
        </NavLink>
        <NavLink to={prefix + URL_CONTENT}
                 styleName={buttonStyle}
                 className={({ isActive }) => (isActive ? styles.activeItem : "")}>
          Content
        </NavLink>
        <NavLink to={prefix + URL_API}
                 styleName={buttonStyle}
                 className={({ isActive }) => (isActive ? styles.activeItem : "")}>
          API
        </NavLink>
        <NavLink to={prefix + URL_SHARING}
                 styleName={buttonStyle}
                 className={({ isActive }) => (isActive ? styles.activeItem : "")}>
          Sharing
        </NavLink>
        <NavLink to={prefix + URL_SETTINGS}
                 styleName={buttonStyle}
                 className={({ isActive }) => (isActive ? styles.activeItem : "")}>
          Settings
        </NavLink>

        <div styleName="caret" ref={el => this.caretRef = el} />
      </div>
    );
  }
}
