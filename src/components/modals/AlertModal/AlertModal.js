import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './AlertModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class AlertModal extends Component {
  componentDidMount() {
    document.onkeydown = this.onKeyPress;
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  onKeyPress = event => {
    event = event || window.event;
    //Enter or Esc pressed
    if (event.keyCode == 13 || event.keyCode == 27)
      setTimeout(this.props.onClose, 1);
  };

  render() {
    const {title, description, buttonText} = this.props.params;
    const {onClose} = this.props;

    return (
      <div styleName="Modal" onKeyPress={this.onKeyPress}>
        <div styleName="bg" onClick={onClose}></div>

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
            <div styleName="button">
              <ButtonControl type="green"
                             value={buttonText}
                             onClick={onClose} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}
