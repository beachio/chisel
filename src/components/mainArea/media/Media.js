import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import MediaView from 'components/elements/MediaView/MediaView';

import styles from './Media.sss';

@CSSModules(styles, {allowMultiple: true})
export default class Media extends Component {
  state = {
    selectedItems: [],
    searchText: ''
  };

  activeInput = null;
  returnFocus = false;

  componentDidUpdate() {
    if (!this.props.alertShowing && this.returnFocus && this.activeInput) {
      this.returnFocus = false;
      setTimeout(() => this.activeInput.focus(), 1);
    }
  }

  onSearch = searchText => {
    this.setState({searchText, selectedItems: []});
  };

  searchMatch(target) {
    if (!this.state.searchText)
      return true;

    const text = this.state.searchText.toLowerCase();
    return target.toLowerCase().indexOf(text) != -1;
  }

  onSearchClear = () => {
    this.setState({searchText: ''});
    this.focusElm.focus();
  };

  render() {
    const {mediaItems, currentSite} = this.props;

    return (
      <ContainerComponent title="Media">
        <div styleName="content">
          <div styleName="input-wrapper">
            <div styleName="input-wrapper-align">
              <InputControl label="Search"
                            DOMRef={c => this.activeInput = c}
                            value={this.state.searchText}
                            placeholder=""
                            icon={this.state.searchText ? "cross" : "search"}
                            onIconClick={this.state.searchText ? this.onSearchClear : null}
                            autoFocus
                            onChange={this.onSearch} />
            </div>
          </div>

          <div styleName="media">
            {
              mediaItems
                .filter(item => !item.assigned)
                .filter(item => item.site == currentSite)
                .filter(item => this.searchMatch(item.name))
                .sort((a, b) => b.origin.updatedAt - a.origin.updatedAt)
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
        </div>

      </ContainerComponent>
    );
  }
}