import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';

import {PAGE_MODELS, PAGE_MODELS_ITEM, PAGE_CONTENT, PAGE_CONTENT_ITEM, PAGE_API, PAGE_SETTINGS, PAGE_SHARING,
  USERSPACE_URL, SITE_URL, MODELS_URL, CONTENT_URL, API_URL, SETTINGS_URL, SHARING_URL} from 'ducks/nav';

import styles, {activeItem} from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
  render() {
    const {siteNameId, openedPage} = this.props;
    
    const prefix = `/${USERSPACE_URL}/${SITE_URL}${siteNameId}/`;

    return (
      <div styleName="menu">
        <Link styleName="button"
              className={openedPage == PAGE_MODELS || openedPage == PAGE_MODELS_ITEM  ? activeItem : ''}
              to={prefix + MODELS_URL}>
          Models
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_CONTENT || openedPage == PAGE_CONTENT_ITEM ? activeItem : ''}
              to={prefix + CONTENT_URL}>
          Content
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_API ? activeItem : ''}
              to={prefix + API_URL}>
          API
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_SETTINGS ? activeItem : ''}
              to={prefix + SETTINGS_URL}>
          Settings
        </Link>
        <Link styleName="button"
              className={openedPage == PAGE_SHARING ? activeItem : ''}
              to={prefix + SHARING_URL}>
          Sharing
        </Link>
      </div>
    );
  }
}