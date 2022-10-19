import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Parse} from 'parse';

import {filterSpecials, trimFileExt} from 'utils/strings';
import {MediaItemData} from 'models/MediaItemData';
import {FILE_SIZE_MAX} from 'ConnectConstants';
import {BYTES, convertDataUnits, M_BYTES} from 'utils/common';
import LoaderComponent from 'components/elements/LoaderComponent/LoaderComponent';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import MediaView from 'components/elements/MediaView/MediaView';

import styles from './Media.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Media extends Component {
  state = {
    selectedItems: [],
    searchText: '',
    loading: false,
    error: ''
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

  onSelect = (item) => {
    let items = this.state.selectedItems;
    let ind = items.indexOf(item);
    if (ind == -1)
      items.push(item);
    else
      items.splice(ind, 1);
    this.setState({selectedItems: items});
  };

  onNew = event => {
    const file = event.target.files[0];
    if (!file)
      return;

    let {type} = file;
    //workaround (when one uplods a font, file.type will be blank)
    const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
    if (!type && (fileExt == `otf` || fileExt == `ttf` || fileExt == `woff` || fileExt == `woff2`))
      type = 'font/' + fileExt;

    const checkSizeError = this.checkSize(file.size);
    if (checkSizeError) {
      this.setState({error: checkSizeError});
      return;
    }

    this.setState({
      error: null,
      loading: true
    });

    let parseFile = new Parse.File(filterSpecials(file.name), file, type);
    parseFile.save().then(() => {
      this.setState({loading: false});

      const {addMediaItem} = this.props;

      let item = new MediaItemData();
      item.file = parseFile;
      item.name = trimFileExt(file.name);
      item.type = type;
      item.size = file.size;
      item.site = this.props.currentSite;
      addMediaItem(item);
    });
  };

  checkSize = size => {
    if (!size)
      return;

    if (size > FILE_SIZE_MAX) {
      let max = convertDataUnits(FILE_SIZE_MAX, BYTES, M_BYTES);
      size = convertDataUnits(size, BYTES, M_BYTES);
      if (size == max)
        return `The file size is greater than the permissible value: ${max} ${M_BYTES}!`;
      else
        return `The file size (${size} ${M_BYTES}) is greater than the permissible value: ${max} ${M_BYTES}!`;
    }
  };

  onClickError = () => {
    this.setState({error: null});
  };

  onFileInputClick = event => {
    event.target.value = null;
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

          {this.state.loading ?
            <div>
              <LoaderComponent/>
            </div>
          :
            <div styleName="media-button media-upload">
              Upload New
              <input styleName="media-hidden"
                     type="file"
                     onChange={this.onNew}
                     onClick={this.onFileInputClick} />
            </div>
          }

          {this.state.error &&
            <div styleName="error"
                 onClick={this.onClickError}>
              {this.state.error}
            </div>
          }

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