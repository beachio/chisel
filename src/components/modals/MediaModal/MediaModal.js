import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import MediaView from 'components/elements/MediaView/MediaView';
import {store} from 'index';

import styles from './MediaModal.sss';
import {FILE_SIZE_MAX} from "ConnectConstants";
import {BYTES, checkFileType, convertDataUnits} from "utils/common";


@CSSModules(styles, {allowMultiple: true})
export default class MediaModal extends Component {
  state = {
    selectedItems: [],
    searchText: ''
  };
  
  isMult = false;
  filters = null;
  active = false;
  callback = null;
  items = [];
  focusElm = null;


  constructor(props) {
    super(props);
    
    this.isMult = props.params.isMult;
    this.filters = props.params.filters;
    this.callback = props.params.callback;
    
    this.items = store.getState().media.items;
  }
  
  componentDidMount() {
    this.active = true;
    document.addEventListener('keydown', this.onKeyDown);
    
    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }
  
  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();
    
    //Enter or Esc pressed
    if (event.keyCode == 13) {
      setTimeout(this.onChoose, 1);
    } else if (event.keyCode == 27) {
      if (this.state.searchText)
        this.setState({searchText: ``});
      else
        setTimeout(this.close, 1);
    }
  };
  
  onSearch = searchText => {
    this.setState({searchText, selectedItems: []});
  };
  
  searchMatch(target) {
    if (!this.state.searchText)
      return true;

    const text = this.state.searchText.toLowerCase();
    return target.toLowerCase().indexOf(text) != -1;
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
  
  onSearchClear = () => {
    this.setState({searchText: ''});
    this.focusElm.focus();
  };

  onChoose = () => {
    if (!this.state.selectedItems.length || !this.active)
      return;
  
    this.callback(this.state.selectedItems);
    this.close();
  };

  close = () => {
    this.active = false;
    this.props.onClose();
  };

  filterSize = item => {
    if (!item.size || !this.filters)
      return true;
  
    const {fileSize} = this.filters;
    if (!fileSize || !fileSize.active)
      return true;
    
    let min = 0;
    if (fileSize.minActive)
      min = convertDataUnits(fileSize.min, fileSize.minUnit, BYTES);
    let max = FILE_SIZE_MAX;
    if (fileSize.maxActive)
      max = convertDataUnits(fileSize.max, fileSize.maxUnit, BYTES);
    
    return item.size >= min && item.size <= max;
  };
  
  filterType = item => {
    if (!item.type || !this.filters)
      return true;
  
    const {fileTypes} = this.filters;
    if (!fileTypes || !fileTypes.active || !fileTypes.types || !fileTypes.types.length)
      return true;
  
    let type = checkFileType(item.type);
  
    for (let typeTemp of fileTypes.types) {
      if (type == typeTemp)
        return true;
    }
    return false;
  };
  
  render() {
    return (
      <div styleName="modal" onClick={this.close}>

        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="content">
            <div styleName="input-wrapper">
              <InputControl type="big"
                            label="search media files"
                            DOMRef={inp => this.focusElm = inp}
                            value={this.state.searchText}
                            icon={this.state.searchText ? "cross" : "search"}
                            onIconClick={this.state.searchText ? this.onSearchClear : null}
                            onChange={this.onSearch} />
            </div>

            <div styleName="media">
              {
                this.items
                  .filter(item => !item.assigned)
                  .filter(this.filterSize)
                  .filter(this.filterType)
                  .filter(item => this.searchMatch(item.name))
                  .map(item => {
                    let itemStyle = "media-item";
                    if (this.state.selectedItems.indexOf(item) != -1)
                      itemStyle += " media-chosen";
  
                    return (
                      <div styleName={itemStyle} key={item.origin.id}>
                        <div styleName="media-header" onClick={() => this.onSelect(item)}>
                          {item.name}
                        </div>
                        <MediaView item={item} />
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
                               onClick={this.close} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
