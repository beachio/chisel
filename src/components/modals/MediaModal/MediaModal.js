import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import MediaView from 'components/elements/MediaView/MediaView';
import {store} from 'index';

import styles from './MediaModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class MediaModal extends Component {
  state = {
    selectedItems: [],
    searchText: ''
  };
  
  isMult = false;
  active = false;
  callback = null;
  items = [];
  focusElm = null;


  constructor(props) {
    super(props);
    
    this.isMult = props.params.isMult;
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
    if (event.keyCode == 13)
      setTimeout(this.onChoose, 1);
  //  else if (event.keyCode == 27)
    //  setTimeout(this.close, 1);
  };
  
  onSearch = (event) => {
    let searchText = event.target.value;
    
    //if there is no selected item in search results, reset selected item
    //if (this.state.selectedItem && !this.searchMatch(searchText, this.state.selectedItem.name))
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

  onSearchKeyDown = event => {
    event.stopPropagation();

    //Esc pressed
    if (event.keyCode == 27)
      this.setState({searchText: ``});
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
                            onKeyDown={this.onSearchKeyDown}
                            onChange={this.onSearch} />
            </div>

            <div styleName="media">
              {
                this.items
                  .filter(item => !item.assigned)
                  .filter(item => this.searchMatch(this.state.searchText, item.name))
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
