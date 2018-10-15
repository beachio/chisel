import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';

import {PAGE_MODELS, PAGE_MODELS_ITEM, PAGE_CONTENT, PAGE_CONTENT_ITEM, PAGE_API, PAGE_SETTINGS, PAGE_SHARING,
  URL_USERSPACE, URL_SITE, URL_MODELS, URL_CONTENT, URL_API, URL_SETTINGS, URL_SHARING} from 'ducks/nav';

import styles, {activeItem} from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
  render() {
    const {siteNameId, openedPage} = this.props;
    
    const prefix = `/${URL_USERSPACE}/${URL_SITE}${siteNameId}/`;

    return (
      <div styleName="menu">
        <Link styleName="button"
              className={openedPage == PAGE_MODELS || openedPage == PAGE_MODELS_ITEM  ? activeItem : ''}
              to={prefix + URL_MODELS}>
          Models
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_CONTENT || openedPage == PAGE_CONTENT_ITEM ? activeItem : ''}
              to={prefix + URL_CONTENT}>
          Content
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_API ? activeItem : ''}
              to={prefix + URL_API}>
          API
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_SETTINGS ? activeItem : ''}
              to={prefix + URL_SETTINGS}>
          Settings
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_SHARING ? activeItem : ''}
              to={prefix + URL_SHARING}>
          Sharing
        </Link>
      </div>
    );
  }
}