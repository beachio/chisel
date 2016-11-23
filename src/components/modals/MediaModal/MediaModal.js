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
  callback = null;
  items = [];


  componentWillMount() {
    this.onClose = this.props.onClose;
    this.callback = this.props.params;
    this.items = store.getState().media.items;
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
                            label="search media files"
                            placeholder="Lake"
                            onChange={this.onChangeName} />
            </div>

            <div styleName="media">
              {
                this.items.map(item => {
                  if (item.contentItem)
                    return null;
                  
                  let imgStyle = {};
                  if (item.file)
                    imgStyle = {backgroundImage: `url(${item.file.url()})`};

                  let itemStyle = "media-item";
                  if (item === this.state.selectedItem)
                    itemStyle += " media-chosen";

                  return (
                    <div styleName={itemStyle}
                         onClick={() => this.onSelect(item)}
                         key={item.origin.id} >
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
