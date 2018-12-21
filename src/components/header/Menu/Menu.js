import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';

import {PAGE_MODELS, PAGE_MODELS_ITEM, PAGE_CONTENT, PAGE_CONTENT_ITEM, PAGE_API, PAGE_SETTINGS, PAGE_SHARING,
  URL_USERSPACE, URL_SITE, URL_MODELS, URL_CONTENT, URL_API, URL_SETTINGS, URL_SHARING} from 'ducks/nav';

import styles, {activeItem} from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {

  constructor(props) {
    super(props);

    this.activeMenuItem = null;
  }

  calcCaretPos = () => {
    const input = this.menuRef.getElementsByClassName('header-link-active')[0]
    const caret = this.caretRef
    
    if (input && caret) {
      const l = input.offsetLeft
      const w = input.offsetWidth
      caret.style = `opacity: 1; transform: translateX(${l}px); width: ${w}px;`
    }
    else {
      caret.style = 'opacity: 0'
    }
  }

  componentDidMount() {

    this.calcCaretPos()
  }

  componentDidUpdate() {
    this.calcCaretPos()
  }

  render() {
    const {siteNameId, openedPage} = this.props;
    
    const prefix = `/${URL_USERSPACE}/${URL_SITE}${siteNameId}/`;

    return (
      <div 
        styleName="menu"
        ref={el => {this.menuRef = el}}
      >
        <Link to={prefix + URL_MODELS}>
          <div styleName="button"
              className={openedPage == PAGE_MODELS || openedPage == PAGE_MODELS_ITEM ? `${activeItem} header-link-active header-link` : 'header-link'}>
            Models
          </div>
          
        </Link>
        <Link to={prefix + URL_CONTENT}>
          <div 
            styleName="button" 
            className={openedPage == PAGE_CONTENT || openedPage == PAGE_CONTENT_ITEM ? `${activeItem} header-link-active header-link` : 'header-link'}>
            Content
          </div>
        </Link>
        <Link to={prefix + URL_API}>
          <div 
            styleName="button"
            className={openedPage == PAGE_API ? `${activeItem} header-link-active header-link` : 'header-link'}
          >
            API
          </div>
        </Link>
        <Link to={prefix + URL_SETTINGS}>
          <div 
            styleName="button"
            className={openedPage == PAGE_SETTINGS ? `${activeItem} header-link-active header-link` : 'header-link'}
          >
            Settings
          </div>
        </Link>
        <Link to={prefix + URL_SHARING}>
          <div 
            styleName="button"
            className={openedPage == PAGE_SHARING ? `${activeItem} header-link-active header-link` : 'header-link'}
          >
            Sharing
          </div>
        </Link>

        <div styleName="caret" ref={el => { this.caretRef = el}}/>
      </div>
    );
  }
}