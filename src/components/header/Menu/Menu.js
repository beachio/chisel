import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';

import {PAGE_MODELS, PAGE_MODELS_ITEM, PAGE_CONTENT, PAGE_CONTENT_ITEM, PAGE_API, PAGE_SETTINGS, PAGE_SHARING,
  URL_USERSPACE, URL_SITE, URL_MODELS, URL_CONTENT, URL_API, URL_SETTINGS, URL_SHARING} from 'ducks/nav';
import {throttle} from 'utils/common';

import styles, {activeItem} from './Menu.sss';


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

    const input = this.menuRef.getElementsByClassName(activeItem)[0];

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
    const {siteNameId, openedPage} = this.props;
    
    const prefix = `/${URL_USERSPACE}/${URL_SITE}${siteNameId}/`;

    return (
      <div styleName="menu"
           ref={el => this.menuRef = el}>
        <Link to={prefix + URL_MODELS}>
          <div styleName="button"
               className={openedPage == PAGE_MODELS || openedPage == PAGE_MODELS_ITEM ? activeItem : ''}>
            Models
          </div>
        </Link>
        <Link to={prefix + URL_CONTENT}>
          <div styleName="button"
               className={openedPage == PAGE_CONTENT || openedPage == PAGE_CONTENT_ITEM ? activeItem : ''}>
            Content
          </div>
        </Link>
        <Link to={prefix + URL_API}>
          <div styleName="button"
               className={openedPage == PAGE_API ? activeItem : ''}>
            API
          </div>
        </Link>
        <Link to={prefix + URL_SHARING}>
          <div styleName="button"
               className={openedPage == PAGE_SHARING ? activeItem : ''}>
            Sharing
          </div>
        </Link>
        <Link to={prefix + URL_SETTINGS}>
          <div styleName="button"
               className={openedPage == PAGE_SETTINGS ? activeItem : ''}>
            Settings
          </div>
        </Link>

        <div styleName="caret" ref={el => this.caretRef = el} />
      </div>
    );
  }
}