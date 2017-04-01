import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {browserHistory} from 'react-router';

import ContentEdit from 'components/mainArea/content/ContentEdit/ContentEdit';
import {ROLE_DEVELOPER} from 'models/UserData';
import {setCurrentItem, addItem, updateItem} from 'ducks/content';
import {addMediaItem, updateMediaItem, removeMediaItem} from 'ducks/media';
import {showModal} from 'ducks/nav';
import {USERSPACE_URL, SITE_URL, CONTENT_URL, ITEM_URL} from 'middleware/routing';
import {getContentByModelAndId} from 'utils/data';

import styles from './ContentEditContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ContentEditContainer extends Component {
  componentWillMount() {
    this.setItem(this.props.params.item);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.item != this.props.params.item)
      this.setItem(nextProps.params.item);
  }
  
  setItem(nameId) {
    const ITEM = 'item~';
    const {setCurrentItem} = this.props.contentActions;
    const {content} = this.props;
  
    if (nameId.indexOf(ITEM) != 0)
      return;
  
    nameId = nameId.slice(ITEM.length);
    
    let modelNameId = nameId.slice(0, nameId.indexOf('~'));
    let itemId = nameId.slice(nameId.indexOf('~') + 1);
    if (modelNameId && itemId) {
      let cItem = content.currentItem;
      if (!cItem || modelNameId != cItem.model.nameId || itemId != cItem.origin.id) {
        let item = getContentByModelAndId(modelNameId, itemId);
        if (item)
          setCurrentItem(item);
      }
    }
  }
  
  render() {
    const {models, content} = this.props;
    const {addItem, updateItem} = this.props.contentActions;
    const {showModal} = this.props.navActions;
    const {addMediaItem, updateMediaItem, removeMediaItem} = this.props.mediaActions;
    
    let curSite = models.currentSite;
    let curItem = content.currentItem;
    if (!curSite || !curItem)
      return null;
    
    let closeItem = () => browserHistory.push(
      `${USERSPACE_URL}${SITE_URL}${curSite.nameId}${CONTENT_URL}`);
    
    let gotoItem = item => {
      let modelId = item.model.nameId;
      let itemId = item.origin.id;
      browserHistory.push(
        `${USERSPACE_URL}${SITE_URL}${curSite.nameId}${CONTENT_URL}${ITEM_URL}${modelId}~${itemId}`);
    };
  
    let lastItem = content.items[content.items.length - 1];
    
    return <ContentEdit item={content.currentItem}
                        onClose={closeItem}
                        gotoItem={gotoItem}
                        addItem={addItem}
                        updateItem={updateItem}
                        addMediaItem={addMediaItem}
                        updateMediaItem={updateMediaItem}
                        removeMediaItem={removeMediaItem}
                        lastItem={lastItem}
                        showModal={showModal}
                        isEditable={models.role != ROLE_DEVELOPER}/>;
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
    contentActions: bindActionCreators({setCurrentItem, addItem, updateItem}, dispatch),
    mediaActions:   bindActionCreators({addMediaItem, updateMediaItem, removeMediaItem}, dispatch),
    navActions:     bindActionCreators({showModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentEditContainer);
