import React, {Component} from 'react';
import InlineSVG from 'svg-inline-react';
import CSSModules from 'react-css-modules';

import styles from './MediaView.sss';


@CSSModules(styles, {allowMultiple: true})
export default class MediaView extends Component {
  render() {
    const {item} = this.props;
    
    if (!item || !item.file)
      return null;
    
    if (item.type.slice(0, 6) == `image/`) {
      return (
        <a href={item.file.url()} target="_blank">
          <div styleName="image"
               style={{backgroundImage: `url(${item.file.url()})`}}>
          </div>
        </a>
      );
    
    } else if (item.type.slice(0, 5) == `text/`) {
      return (
        <a href={item.file.url()} target="_blank">
          <InlineSVG styleName="icon"
                     src={require('assets/images/media-types/txt.svg')} />
        </a>
      );
    
    } else if (item.type == `application/pdf`) {
      return (
        <a href={item.file.url()} target="_blank">
          <InlineSVG styleName="icon"
                     src={require('assets/images/media-types/pdf.svg')} />
        </a>
      );
    
    } else if (item.type == `application/msword` || item.type == `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) {
      return (
        <a href={item.file.url()} target="_blank">
          <InlineSVG styleName="icon"
                     src={require('assets/images/media-types/doc.svg')} />
        </a>
      );
    
    } else if (item.type.slice(0, 6) == `audio/`) {
      return (
        <audio src={item.file.url()}
               type={item.type}
               controls
               styleName="audio">
        </audio>
      );
    
    } else if (item.type.slice(0, 6) == `video/`) {
      return (
        <video src={item.file.url()}
               type={item.type}
               controls
               styleName="video">
        </video>
      );
    
    } else {
      return (
        <a href={item.file.url()} target="_blank">
          <InlineSVG styleName="icon"
                     src={require('assets/images/media-types/other.svg')}/>
        </a>
      );
    }
  }
}