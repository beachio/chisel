import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './ModelModal.sss';

import SwitchControl from '../../SwitchControl/SwitchControl';

@CSSModules(styles, {allowMultiple: true})
export default class ModelModal extends Component  {

  state = {
    valueInput: ''
  }

  onChangeValue(event) {
    this.setState({
      valueInput: event.target.value
    });
  }

  render() {
    let camelize = (str) => {
      return str.replace(/\W+(.)/g, (match, chr) => {
          return chr.toUpperCase();
      });
    }

    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="modal-header">
            <div styleName="title">Title</div>
            <div styleName="subtitle">Short Text</div>
          </div>
          <div styleName="content">

            <form>
              <div styleName="input-wrapper">
                <input styleName="input" placeholder="Name" onChange={this.onChangeValue.bind(this)} value={this.state.valueInput} />
              </div>
              <div styleName="input-wrapper">
                <input styleName="input input-readonly" placeholder="name" value={camelize(this.state.valueInput)} readOnly/>
                <div styleName="label">Field ID</div>
              </div>

              <div styleName="input-wrapper">
                <SwitchControl />
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}
