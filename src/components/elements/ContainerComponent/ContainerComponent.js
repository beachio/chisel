import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './ContainerComponent.sss';

@CSSModules(styles, {allowMultiple: true})
export default class ContainerComponent extends Component {
  render() {
    const { title, children, onClickBack, description, onClickJSON, JSONName } = this.props;

    let back;
    let headerStyles = 'header';
    let json = (
      <div styleName="json-fields" onClick={onClickJSON}>
        {JSONName}
      </div>
    );

    if (description)
      headerStyles = 'header header-description';

    if (onClickBack) {
      back = (
        <div styleName='back' onClick={ onClickBack }>
          Back
        </div>
      );
    }

    return (
      <div styleName='ContainerComponent'>
        <div styleName={headerStyles}>
          { back }
          <div>
            <div styleName='title'>
              { title }
            </div>
            <div styleName="description">
              { description }
            </div>
          </div>

          { json }
        </div>
        <div styleName='content'>
          { children }
        </div>
      </div>
    );
  }
}
