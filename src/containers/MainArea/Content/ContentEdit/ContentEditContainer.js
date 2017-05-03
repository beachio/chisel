import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";

import ContentEdit from 'components/mainArea/content/ContentEdit/ContentEdit';
import {ROLE_DEVELOPER} from 'models/UserData';
import {setCurrentItem, addItem, updateItem, publishItem, discardItem, archieveItem, restoreItem} from 'ducks/content';
import {addMediaItem, updateMediaItem, removeMediaItem} from 'ducks/media';
import {showModal, CONTENT_URL, ITEM_URL, USERSPACE_URL, SITE_URL} from 'ducks/nav';
import {getContentByModelAndId} from 'utils/data';


export class ContentEditContainer extends Component {
  //TODO Костыль!
  item = null;
  
  componentWillMount() {
    this.setItem(this.props.params.item);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.item != this.props.params.item)
      this.setItem(nextProps.params.item);
  }
  
  setItem(nameId) {
    const {setCurrentItem} = this.props.contentActions;
    const {content} = this.props;
  
    if (nameId.indexOf(ITEM_URL) != 0)
      return;
  
    nameId = nameId.slice(ITEM_URL.length);
  
    const modelNameId = nameId.slice(0, nameId.indexOf('~'));
    const itemId = nameId.slice(nameId.indexOf('~') + 1);
    if (modelNameId && itemId) {
      this.item = content.currentItem;
      if (!this.item || modelNameId != this.item.model.nameId || itemId != this.item.origin.id) {
        const item = getContentByModelAndId(modelNameId, itemId);
        if (item) {
          setCurrentItem(item);
          this.item = item;
        }
      }
    }
  }
  
  render() {
    const {models, content} = this.props;
    const {addItem, updateItem, publishItem, discardItem, archieveItem, restoreItem} = this.props.contentActions;
    const {showModal} = this.props.navActions;
    const {addMediaItem, updateMediaItem, removeMediaItem} = this.props.mediaActions;
    
    const curSite = models.currentSite;
    if (!curSite || !this.item)
      return null;
    
    const basePath = `/${USERSPACE_URL}/${SITE_URL}${curSite.nameId}/${CONTENT_URL}`;
    
    const closeItem = () => browserHistory.push(basePath);
  
    const gotoItem = item => {
      let modelId = item.model.nameId;
      let itemId = item.origin.id;
      browserHistory.push(`${basePath}/${ITEM_URL}${modelId}~${itemId}`);
    };
  
    const lastItem = content.items[content.items.length - 1];
  
    const itemTitle = this.item.title ? this.item.title : 'Untitled';
    const title = `Item: ${itemTitle} - Site: ${curSite.name} - Chisel`;
    
    return (
      <div className="mainArea">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <ContentEdit item={this.item}
                     onClose={closeItem}
                     gotoItem={gotoItem}
                     addItem={addItem}
                     updateItem={updateItem}
                     publishItem={publishItem}
                     archieveItem={archieveItem}
                     restoreItem={restoreItem}
                     discardItem={discardItem}
                     addMediaItem={addMediaItem}
                     updateMediaItem={updateMediaItem}
                     removeMediaItem={removeMediaItem}
                     lastItem={lastItem}
                     showModal={showModal}
                     isEditable={models.role != ROLE_DEVELOPER}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models:   state.models,
    content:  state.content
  };
}

function mapDispatchToProps(dispatch) {
  return {
    contentActions: bindActionCreators({setCurrentItem, addItem, updateItem, publishItem, discardItem, archieveItem, restoreItem}, dispatch),
    mediaActions:   bindActionCreators({addMediaItem, updateMediaItem, removeMediaItem}, dispatch),
    navActions:     bindActionCreators({showModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentEditContainer);
