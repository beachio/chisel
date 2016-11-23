import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {store} from 'index';

import styles from './ReferenceModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ReferenceModal extends Component {
  state = {
    selectedItem: null
  };
  onClose = null;
  callback = null;
  items = [];
  
  
  componentWillMount() {
    this.onClose = this.props.onClose;
    this.callback = this.props.params;
    this.items = store.getState().content.items;
  }
  
  onSelect = (item) => {
    this.setState({selectedItem: item});
  };
  
  onChoose = () => {
    this.callback(this.state.selectedItem);
    this.onClose();
  };

  render() {
    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="content">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            label="search entries"
                            placeholder="My Post"
                            onChange={this.onChangeName} />
            </div>

            <div styleName="reference">
              {
                this.items.map(item => {
                  let style = "reference-item";
                  if (item == this.state.selectedItem)
                    style += " reference-chosen";
                  
                  return (
                    <div styleName={style}
                         key={item.origin.id}
                         onClick={() => this.onSelect(item)}>
                      [{item.model.name}] {item.title}
                    </div>
                  );
                })
              }
            </div>

            <div styleName="input-wrapper buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="green"
                               value="Choose"
                               disabled={!this.state.selectedItem}
                               onClick={this.onChoose} />
              </div>
              <div styleName="buttons-inner">
                <ButtonControl color="gray"
                               value="Cancel"
                               onClick={this.onClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
