import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Parse} from 'parse';

import ContentBase from './ContentBase';
import {MediaItemData} from 'models/MediaItemData';
import {FILE_SIZE_MAX} from 'constants';
import {MODAL_TYPE_MEDIA} from 'ducks/nav';
import {trimFileExt, filterSpecials} from 'utils/common';
import MediaView from 'components/elements/MediaView/MediaView';

import styles from '../ContentEdit.sss';


const AUTOSAVE_TIMEOUT = 2000;


@CSSModules(styles, {allowMultiple: true})
export default class ContentMedia extends ContentBase {
  site = null;
  mediaTimeouts = [];
  
  
  constructor (props) {
    super(props);
    
    this.site = props.site;
  }
  
  onMediaChoose = () => {
    if (!this.state.isEditable)
      return;
    
    this.props.showModal(MODAL_TYPE_MEDIA, {
      isMult: this.field.isList,
      
      callback: itemsSrc => {
        let newItems = [];
        for (let itemSrc of itemsSrc) {
          let item = itemSrc.clone();
          this.props.addMediaItem(item);
          newItems.push(item);
        }
        
        if (this.field.isList) {
          let items = this.state.value;
          if (!items)
            items = [];
          this.setValue(items.concat(newItems), true);
          
        } else {
          this.setValue(newItems[0], true);
        }
      }
    });
  };
  
  onMediaNew = event => {
    let file = event.target.files[0];
    if (!file)
      return;
    if (file.size > FILE_SIZE_MAX) {
      let error = `Your file's size exceeds a limit of 10 MB.`;
      this.setState({error});
      return;
    }
    
    let parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    parseFile.save().then(() => {
      const {addMediaItem} = this.props;
      
      let item = new MediaItemData();
      item.file = parseFile;
      item.name = trimFileExt(file.name);
      item.type = file.type;
      item.site = this.site;
      addMediaItem(item);
      
      item = item.clone();
      item.assigned = true;
      addMediaItem(item);
      
      if (this.field.isList) {
        let items = this.state.value;
        if (!items)
          items = [];
        this.setValue(items.concat(item), true);
      } else {
        this.setValue(item, true);
      }
    });
  };
  
  onMediaClear(item) {
    this.props.removeMediaItem(item);
    
    if (this.field.isList) {
      let items = this.state.value;
      items.splice(items.indexOf(item), 1);
      this.setValue(items, true);
    } else {
      this.setValue(null, true);
    }
  }
  
  onMediaNameChange(event, item) {
    let value = event.target.value;
    item.name = value;
    
    if (!this.mediaTimeouts[item.key])
      this.mediaTimeouts[item.key] = setTimeout(() => {
        this.props.updateMediaItem(item);
        this.mediaTimeouts[item.key] = 0;
      }, AUTOSAVE_TIMEOUT);
    
    this.setValue(this.state.value);
  }
  
  getInput() {
    let value = this.state.value;
    
    let oneMediaBlock = item => {
      return (
        <div styleName="media-item" key={item.key}>
          <div styleName="media-header">
            <input type="text"
                   placeholder="File name"
                   readOnly={!this.state.isEditable}
                   onChange={e => this.onMediaNameChange(e, item)}
                   value={item.name} />
            {
              this.state.isEditable &&
                <InlineSVG styleName="media-cross"
                           src={require('assets/images/cross.svg')}
                           onClick={() => this.onMediaClear(item)}/>
            }
          </div>
          <MediaView item={item} />
        </div>
      );
    };
  
    let btnStyle = `media-button`;
    if (!this.state.isEditable)
      btnStyle += ` media-button-disabled`;
    let addMediaBlock = (
      <div styleName="media-buttons">
        <div type="file" styleName={btnStyle + ` media-upload`}>
          Upload New
          <input styleName="media-hidden"
                 type="file"
                 disabled={!this.state.isEditable}
                 onChange={this.onMediaNew} />
        </div>
        <div styleName={btnStyle + ` media-insert`}
             onClick={this.onMediaChoose}>
          Insert Existing
        </div>
      </div>
    );
  
    let mediaInner = addMediaBlock;
    if (this.field.isList) {
      if (value && value.length)
        mediaInner = (
          <div>
            {value.map(oneMediaBlock)}
            {addMediaBlock}
          </div>
        );
    
    } else {
      if (value && value.file)
        mediaInner = oneMediaBlock(value);
    }
  
    return (
      <div styleName="media">
        {mediaInner}
      </div>
    );
  }
  
}
