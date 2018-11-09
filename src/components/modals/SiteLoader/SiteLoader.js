import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import LoaderComponent from 'components/elements/LoaderComponent/LoaderComponent';

import styles from './SiteLoader.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SiteLoader extends Component  {
  render() {
    return (
      <div styleName="loader-wrapper">
        <LoaderComponent />
      </div>
    );
  }
}
