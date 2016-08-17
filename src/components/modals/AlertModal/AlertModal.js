import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from '../../elements/ButtonControl/ButtonControl';

import styles from './AlertModal.sss';

@CSSModules(styles, {allowMultiple: true})
export default class AlertModal extends Component {
  render() {
    const {title, description, buttonText} = this.props.alertParams;
    const {onClose} = this.props;

    return (
      <div styleName="Modal">
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

            <ButtonControl type="green" value={buttonText} onClick={onClose}/>
          </div>

        </div>
      </div>
    );
  }
}
