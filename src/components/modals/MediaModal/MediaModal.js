import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {store} from 'index';

import styles from './MediaModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class MediaModal extends Component {
  state = {
    selectedItem: null
  };
  onClose = null;
  field = null;
  items = [];


  componentWillMount() {
    this.onClose = this.props.onClose;
    this.field = this.props.field;
    this.items = store.getState().media.items;
  }

  onSelect = (item) => {
    this.setState({selectedItem: item});
  };

  onChoose = () => {
    if (this.state.selectedItem) {
      this.field.value = this.state.selectedItem.file;
      this.props.updateField(this.field);
    }
    this.onClose();
  };

  render() {
    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="content">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            label="search media files"
                            placeholder="Lake"
                            onChange={this.onChangeName} />
            </div>

            <div styleName="media">
              {
                this.items.map(item => {
                  let imgStyle = {};
                  if (item.file)
                    imgStyle = {backgroundImage: `url(${item.file.url()})`};

                  let itemStyle = "media-item";
                  if (item === this.state.selectedItem)
                    itemStyle += " media-chosen";

                  let key = Math.random();

                  return (
                    <div styleName={itemStyle}
                         onClick={() => this.onSelect(item)}
                         key={key} >
                      <div styleName="media-header">
                        {item.name}
                      </div>
                      <div styleName="media-content" style={imgStyle}></div>
                    </div>
                  );
                })
              }
            </div>

            <div styleName="input-wrapper buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="green"
                               value="Choose"
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
