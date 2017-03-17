import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {store} from 'index';

import styles from './ReferenceModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ReferenceModal extends Component {
  state = {
    selectedItems: [],
    searchText: ''
  };
  
  active = false;
  isMult = false;
  existingItems = [];
  onClose = null;
  callback = null;
  items = [];
  focusElm = null;
  
  
  componentWillMount() {
    this.onClose = this.props.onClose;
    this.isMult = this.props.params.isMult;
    this.existingItems = this.props.params.existingItems;
    this.callback = this.props.params.callback;
    
    let allItems = store.getState().content.items;
    let curSite = store.getState().models.currentSite;
    for (let item of allItems) {
      if (!item.model.site || item.model.site == curSite)
        if (this.existingItems.indexOf(item) == -1)
          this.items.push(item);
    }
  }
  
  componentDidMount() {
    this.active = true;
    document.onkeydown = this.onKeyPress;
    
    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
  }
  
  componentWillUnmount() {
    document.onkeydown = null;
    this.active = false;
  }
  
  onKeyPress = () => {
    let event = window.event;
    event.stopPropagation();
    
    //Enter or Esc pressed
    if (event.keyCode == 13)
      setTimeout(this.onChoose, 1);
    else if (event.keyCode == 27)
      setTimeout(this.props.onClose, 1);
  };
  
  onSearch = (event) => {
    let searchText = event.target.value;
  
    //if there is no selected item in search results, reset selected item
    //if (this.state.selectedItem && !this.searchMatch(searchText, this.state.selectedItem.title))
      this.setState({searchText, selectedItems: []});
    //else
      //this.setState({searchText});
  };
  
  searchMatch(search, target) {
    if (!search)
      return true;
    return target.toLowerCase().indexOf(search.toLowerCase()) != -1;
  }
  
  onSelect = (item) => {
    if (this.isMult) {
      let items = this.state.selectedItems;
      let ind = items.indexOf(item);
      if (ind == -1)
        items.push(item);
      else
        items.splice(ind, 1);
      this.setState({selectedItems: items});
    } else {
      this.setState({selectedItems: [item]});
    }
  };
  
  onChoose = () => {
    if (!this.state.selectedItems.length || !this.active)
      return;
    
    this.callback(this.isMult ?
      this.state.selectedItems :
      this.state.selectedItems[0]);
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
                            DOMRef={inp => this.focusElm = inp}
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
                  if (this.state.selectedItems.indexOf(item) != -1)
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
                               disabled={!this.state.selectedItems.length}
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
