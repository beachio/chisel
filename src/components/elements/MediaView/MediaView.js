import React, {Component} from 'react';
import InlineSVG from 'svg-inline-react';
import CSSModules from 'react-css-modules';

import {
  checkFileType, TYPE_AUDIO, TYPE_IMAGE, TYPE_PDF, TYPE_TEXT, TYPE_F_TEXT, TYPE_VIDEO, TYPE_HTML, TYPE_PRESENT,
  TYPE_TABLE, TYPE_JSON, TYPE_XML, TYPE_MARKDOWN, TYPE_ARCHIVE, TYPE_EXE
} from "utils/common";

import styles from './MediaView.sss';


@CSSModules(styles, {allowMultiple: true})
export default class MediaView extends Component {
  getIconName (type) {
    switch (checkFileType(type)) {
      case TYPE_TEXT:     return 'txt';
      case TYPE_HTML:     return 'html';
      case TYPE_XML:      return 'xml';
      case TYPE_MARKDOWN: return 'md';
      case TYPE_JSON:     return 'json';
      case TYPE_PDF:      return 'pdf';
      case TYPE_F_TEXT:   return 'doc';
      case TYPE_TABLE:    return 'xls';
      case TYPE_PRESENT:  return 'ppt';
      case TYPE_ARCHIVE:  return 'archive';
      case TYPE_EXE:      return 'exe';
    }
    return 'other';
  }
  
  getIcon (item) {
    const iconName = this.getIconName(item.type);
    return (
      <a styleName="link"
         href={item.file.url()}
         target="_blank">
        <InlineSVG styleName="icon"
                   src={require(`assets/images/media-types/${iconName}.svg`)} />
      </a>
    );
  }
  
  render() {
    const {item} = this.props;
    
    if (!item || !item.file)
      return null;
    
    switch (checkFileType(item.type)) {
      case TYPE_IMAGE:
        return (
          <a href={item.file.url()}
             target="_blank">
            <div styleName="image"
                 style={{backgroundImage: `url(${item.file.url()})`}}>
            </div>
          </a>
        );
    
      case TYPE_AUDIO:
        return (
          <audio src={item.file.url()}
                 type={item.type}
                 controls
                 styleName="audio">
          </audio>
        );
    
      case TYPE_VIDEO:
        return (
          <video src={item.file.url()}
                 type={item.type}
                 controls
                 styleName="video">
          </video>
        );
    
      default:
        return this.getIcon(item);
    }
  }
}
