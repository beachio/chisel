import React, {Component} from 'react';
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
  callback = null;
  items = [];
  focusElm = null;
  active = false;
  
  
  constructor(props) {
    super(props);
    
    this.isMult = props.params.isMult;
    this.callback = props.params.callback;
    
    const {currentItem, existingItems, validModels} = props.params;
    const {contentItems, currentSite} = props;
    
    this.items = contentItems
      .filter(item =>
        (!item.model.site || item.model.site == currentSite) &&
        existingItems.indexOf(item) == -1 &&
        item != currentItem);
    
    if (validModels)
      this.items = this.items.filter(item =>
        validModels.indexOf(item.model.nameId) != -1);
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
    
    this.callback(this.isMult ?
      this.state.selectedItems :
      this.state.selectedItems[0]);
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
                            label="search entries"
                            icon={this.state.searchText ? "cross" : "search"}
                            onIconClick={this.state.searchText ? this.onSearchClear : null}
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
                               onClick={this.close} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
