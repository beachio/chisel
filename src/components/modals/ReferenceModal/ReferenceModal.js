import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {store} from 'index';

import styles from './ReferenceModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ReferenceModal extends Component {
  state = {
    selectedItem: null,
    searchText: ''
  };
  onClose = null;
  callback = null;
  items = [];
  
  
  componentWillMount() {
    this.onClose = this.props.onClose;
    this.callback = this.props.params;
    
    let allItems = store.getState().content.items;
    let curSite = store.getState().models.currentSite;
    for (let item of allItems) {
      if (!item.model.site || item.model.site == curSite)
        this.items.push(item);
    }
  }
  
  onSearch = (event) => {
    let searchText = event.target.value;
  
    //if there is no selected item in search results, reset selected item
    if (this.state.selectedItem && !this.searchMatch(searchText, this.state.selectedItem.title))
      this.setState({searchText, selectedItem: null});
    else
      this.setState({searchText});
  };
  
  searchMatch(search, target) {
    if (!search)
      return true;
    return target.toLowerCase().indexOf(search.toLowerCase()) != -1;
  }
  
  onSelect = (item) => {
    this.setState({selectedItem: item});
  };
  
  onChoose = () => {
    this.callback(this.state.selectedItem);
    this.onClose();
  };

  render() {
    let currentItem = store.getState().content.currentItem;
    
    return (
      <div styleName="modal">
        <div styleName="modal-inner">
          <div styleName="content">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            label="search entries"
                            value={this.state.searchText}
                            onChange={this.onSearch} />
            </div>

            <div styleName="reference">
              {
                this.items.map(item => {
                  if (currentItem == item)
                    return null;
  
                  if (!this.searchMatch(this.state.searchText, item.title))
                    return null;
                  
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
