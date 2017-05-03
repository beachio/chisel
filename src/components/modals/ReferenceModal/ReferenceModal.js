import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';

import styles from './ReferenceModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ReferenceModal extends Component {
  state = {
    selectedItems: [],
    searchText: ''
  };
  
  isMult = false;
  onClose = null;
  callback = null;
  items = [];
  focusElm = null;
  active = false;
  
  
  constructor(props) {
    super(props);
    
    this.isMult = props.params.isMult;
    this.callback = props.params.callback;
    this.onClose = props.onClose;
    
    const {currentItem, existingItems} = props.params;
    const allItems = props.contentItems;
    const curSite = props.currentSite;
    
    for (let item of allItems) {
      if ((!item.model.site || item.model.site == curSite) &&
          existingItems.indexOf(item) == -1 &&
          item != currentItem)
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
    const event = window.event;
    event.stopPropagation();
    
    //Enter or Esc pressed
    if (event.keyCode == 13)
      setTimeout(this.onChoose, 1);
    else if (event.keyCode == 27)
      setTimeout(this.props.onClose, 1);
  };
  
  onSearch = (event) => {
    const searchText = event.target.value;
  
    //if there is no selected item in search results, reset selected item
    //if (this.state.selectedItem && !this.searchMatch(searchText, this.state.selectedItem.title))
      this.setState({searchText, selectedItems: []});
    //else
      //this.setState({searchText});
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
  
  onChoose = () => {
    if (!this.state.selectedItems.length || !this.active)
      return;
    
    this.callback(this.isMult ?
      this.state.selectedItems :
      this.state.selectedItems[0]);
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
                            value={this.state.searchText}
                            DOMRef={inp => this.focusElm = inp}
                            onChange={this.onSearch} />
            </div>

            <div styleName="reference">
              {
                this.items
                  .filter(item => this.searchMatch(item.title))
                  .map(item => {
                    let style = "reference-item";
                    if (this.state.selectedItems.indexOf(item) != -1)
                      style += " reference-chosen";
                    
                    let title = item.title;
                    if (!title)
                      title = <span styleName="untitled">Untitled</span>;
                    
                    return (
                      <div styleName={style}
                           key={item.origin.id}
                           onClick={() => this.onSelect(item)}>
                        [{item.model.name}] {title}
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
