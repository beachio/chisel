import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';

import {USERSPACE_URL, SITE_URL} from 'middleware/routing';
import {PAGE_MODELS, PAGE_CONTENT, PAGE_API, PAGE_SETTINGS, PAGE_SHARING} from 'ducks/nav';

import styles, {activeItem} from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
  render() {
    const {siteNameId, openedPage} = this.props;
    
    let prefix = `${USERSPACE_URL}${SITE_URL}${siteNameId}/`;

    return (
      <div styleName="menu">
        <Link styleName="button" className={openedPage == PAGE_MODELS   ? activeItem : ''} to={prefix + 'models'}  >Models</Link>
        <Link styleName="button" className={openedPage == PAGE_CONTENT  ? activeItem : ''} to={prefix + 'content'} >Content</Link>
        <Link styleName="button" className={openedPage == PAGE_API      ? activeItem : ''} to={prefix + 'api'}     >API</Link>
        <Link styleName="button" className={openedPage == PAGE_SETTINGS ? activeItem : ''} to={prefix + 'settings'}>Settings</Link>
        <Link styleName="button" className={openedPage == PAGE_SHARING  ? activeItem : ''} to={prefix + 'sharing'} >Sharing</Link>
      </div>
    );
  }
}