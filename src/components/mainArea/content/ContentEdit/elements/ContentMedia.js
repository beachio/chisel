import React from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {Parse} from 'parse';

import ContentBase from './ContentBase';
import {MediaItemData} from 'models/MediaItemData';
import {FILE_SIZE_MAX} from 'ConnectConstants';
import {MODAL_TYPE_MEDIA} from 'ducks/nav';
import {trimFileExt, filterSpecials, convertDataUnits, BYTES, M_BYTES, checkFileType, TYPE_OTHER} from 'utils/common';
import MediaView from 'components/elements/MediaView/MediaView';
import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";
import InputControl from "components/elements/InputControl/InputControl";

import styles from '../ContentEdit.sss';


const AUTOSAVE_TIMEOUT = 2000;


@CSSModules(styles, {allowMultiple: true})
export default class ContentMedia extends ContentBase {
  site = null;
  mediaTimeouts = [];
  
  
  constructor (props) {
    super(props);
    
    this.site = props.site;
    
    this.state.loading = false;
  }
  
  checkSize = size => {
    if (!size)
      return;
    
    let max = FILE_SIZE_MAX;
    let fileSizeValid;
    
    if (this.field.validations && this.field.validations.fileSize && this.field.validations.fileSize.active) {
      fileSizeValid = this.field.validations.fileSize;
  
      let min = 0;
      if (fileSizeValid.minActive)
        min = convertDataUnits(fileSizeValid.min, fileSizeValid.minUnit, BYTES);
      if (fileSizeValid.maxActive)
        max = convertDataUnits(fileSizeValid.max, fileSizeValid.maxUnit, BYTES);
  
      if (size < min) {
        let error = fileSizeValid.errorMsg;
        if (!error) {
          const unit = fileSizeValid.minUnit == BYTES ? 'bytes' : fileSizeValid.minUnit;
          size = convertDataUnits(size, BYTES, fileSizeValid.minUnit);
          error = `The file size (${size} ${unit}) is smaller than the permissible value: ${fileSizeValid.min} ${unit}!`;
        }
        return error;
      }
    }
    
    if (size > max) {
      let error;
      if (fileSizeValid && fileSizeValid.maxActive) {
        error = fileSizeValid.errorMsg;
        if (!error) {
          const unit = fileSizeValid.maxUnit == BYTES ? 'bytes' : fileSizeValid.maxUnit;
          size = convertDataUnits(size, BYTES, fileSizeValid.maxUnit);
          error = `The file size (${size} ${unit}) is greater than the permissible value: ${fileSizeValid.max} ${unit}!`;
        }
      } else {
        max = convertDataUnits(FILE_SIZE_MAX, BYTES, M_BYTES);
        const unit = M_BYTES;
        size = convertDataUnits(size, BYTES, M_BYTES);
        error = `The file size (${size} ${unit}) is greater than the permissible value: ${max} ${unit}!`;
      }
      return error;
    }
  };
  
  checkType = type => {
    if (!type || !this.field.validations)
      return;
    
    const {fileTypes} = this.field.validations;
    if (!fileTypes || !fileTypes.active || !fileTypes.types || !fileTypes.types.length)
      return;
    
    type = checkFileType(type);
    
    for (let typeTemp of fileTypes.types) {
      if (type == typeTemp)
        return;
    }
  
    let error = fileTypes.errorMsg;
    if (!error) {
      if (type != TYPE_OTHER)
        error = `The ${type} file type is unsupported!`;
      else
        error = `The file type is unsupported!`;
    }
    
    return error;
  };
  
  getError () {
    const baseError = super.getError();
    if (baseError)
      return baseError;
  
    const checkValidations = item => {
      let error = this.checkSize(item.size);
      if (error)
        return error;
      error = this.checkType(item.type);
      if (error)
        return error;
    };
  
    const value = this.state.value;
    if (this.field.isList) {
      for (let itemValue of value) {
        let error = checkValidations(itemValue);
        if (error)
          return error;
      }
    
    } else if (value) {
      return checkValidations(value);
    }
  }
  
  onMediaChoose = () => {
    if (!this.state.isEditable)
      return;
    
    this.props.showModal(MODAL_TYPE_MEDIA, {
      isMult: this.field.isList,
      filters: this.field.validations,
      
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
    const file = event.target.files[0];
    if (!file)
      return;
    
    const checkSizeError = this.checkSize(file.size);
    if (checkSizeError) {
      this.setState({error: checkSizeError});
      return;
    }
  
    const checkTypeError = this.checkType(file.type);
    if (checkTypeError) {
      this.setState({error: checkTypeError});
      return;
    }
    
    this.setState({loading: true});
    let parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    parseFile.save().then(() => {
      this.setState({loading: false});
      
      const {addMediaItem} = this.props;
      
      let item = new MediaItemData();
      item.file = parseFile;
      item.name = trimFileExt(file.name);
      item.type = file.type;
      item.size = file.size;
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
  
  onMediaNameChange(value, item) {
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
            <InputControl placeholder="File name"
                          readOnly={!this.state.isEditable}
                          onChange={e => this.onMediaNameChange(e, item)}
                          value={item.name} />
            {
              this.state.isEditable &&
                <InlineSVG styleName="media-cross"
                           src={require('assets/images/icon-delete.svg')}
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
  
    let addMediaBlock;
    if (this.state.loading) {
      addMediaBlock = (
        <div styleName="loader-wrapper">
          <LoaderComponent/>
        </div>
      );
    } else {
      addMediaBlock = (
        <div styleName="media-buttons">
          <div styleName={btnStyle + ` media-upload`}>
            Upload New
            <input styleName="media-hidden"
                   type="file"
                   disabled={!this.state.isEditable}
                   onChange={this.onMediaNew}/>
          </div>
          <div styleName={btnStyle + ` media-insert`}
               onClick={this.onMediaChoose}>
            Insert Existing
          </div>
        </div>
      );
    }
  
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
