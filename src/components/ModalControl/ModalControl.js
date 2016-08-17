import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from '../ButtonControl/ButtonControl';

import styles from './ModalControl.sss';

@CSSModules(styles, {allowMultiple: true})
export default class ModalControl extends Component {
  render() {
    const {title, description, buttonText} = this.props;

    return (
      <div styleName="ModalControl">
        <div styleName="bg"></div>

        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">
              {title || 'Title'}
            </div>
          </div>

          <div styleName="content">
            <div styleName="description">
              {description || 'Description'}
            </div>

            <ButtonControl type="green" value={buttonText} />
          </div>

        </div>
      </div>
    );
  }
}
