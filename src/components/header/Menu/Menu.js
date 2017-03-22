import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';

import {USERSPACE_URL, SITE_URL} from 'middleware/routing';

import styles, {activeItem} from './Menu.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Menu extends Component  {
  render() {
    const {siteNameId} = this.props;
    
    let prefix = `${USERSPACE_URL}${SITE_URL}${siteNameId}/`;

    return (
      <div styleName="menu">
        <Link styleName="button" activeClassName={activeItem} to={prefix + 'models'}  >Models</Link>
        <Link styleName="button" activeClassName={activeItem} to={prefix + 'content'} >Content</Link>
        <Link styleName="button" activeClassName={activeItem} to={prefix + 'api'}     >API</Link>
        <Link styleName="button" activeClassName={activeItem} to={prefix + 'settings'}>Settings</Link>
        <Link styleName="button" activeClassName={activeItem} to={prefix + 'sharing'} >Sharing</Link>
      </div>
    );
  }
}
