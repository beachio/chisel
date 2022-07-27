import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";

import ContentEdit from 'components/mainArea/content/ContentEdit/ContentEdit';
import {ROLE_DEVELOPER} from 'models/UserData';
import {
  setCurrentItem,
  addItem,
  updateItem,
  publishItem,
  discardItem,
  archiveItem,
  restoreItem,
  deleteItem,
  pushToItemsHistory,
  popFromItemsHistory
} from 'ducks/content';
import {addMediaItem, updateMediaItem, removeMediaItem} from 'ducks/media';
import {
  showModal,
  showAlert,
  showNotification,
  closeNotification,
  URL_CONTENT,
  URL_ITEM,
  URL_USERSPACE,
  URL_SITE
} from 'ducks/nav';
import {getContentByModelAndId} from 'utils/data';


export class ContentEditContainer extends Component {
  //TODO: костыль
  item = null;

  constructor(props) {
    super(props);
    this.setItem(props.match.params.item);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.item != this.props.match.params.item)
      this.setItem(this.props.match.params.item);
  }

  // on mount / change item:
  // get item ID from URL, then send action "setCurrentItem"
  setItem(nameId) {
    const modelNameId = nameId.slice(0, nameId.indexOf('~'));
    const itemId = nameId.slice(nameId.indexOf('~') + 1);
    if (!modelNameId || !itemId)
      return;

    const {setCurrentItem} = this.props.contentActions;
    const {content} = this.props;
    this.item = content.currentItem;

    const item = getContentByModelAndId(modelNameId, itemId);
    if (item && item != this.item) {
      this.item = item;
      setCurrentItem(item);
    }
  }

  render() {
    const {models, content, nav} = this.props;
    const {addItem, updateItem, publishItem, discardItem, archiveItem, restoreItem, deleteItem, pushToItemsHistory, popFromItemsHistory} = this.props.contentActions;
    const {showModal, showAlert, showNotification, closeNotification} = this.props.navActions;
    const {addMediaItem, updateMediaItem, removeMediaItem} = this.props.mediaActions;

    const site = models.currentSite;
    const item = this.item;
    if (!site || !item)
      return null;

    const basePath = `/${URL_USERSPACE}/${URL_SITE}${site.nameId}/${URL_CONTENT}`;

    const closeItem = () => this.props.history.push(basePath);

    const gotoItem = (item, prevItem, replace) => {
      if (!replace) {
        if (prevItem)
          pushToItemsHistory(prevItem);
        else
          popFromItemsHistory(item);
      }
      let modelId = item.model.nameId;
      let itemId = item.origin.id;
      if (replace)
        this.props.history.replace(`${basePath}/${URL_ITEM}${modelId}~${itemId}`);
      else
        this.props.history.push(`${basePath}/${URL_ITEM}${modelId}~${itemId}`);
    };

    const gotoList = () =>
      this.props.history.push(basePath);

    const lastItem = content.items[content.items.length - 1];

    const itemTitle = item.title ? item.title : 'Untitled';
    const title = `Item: ${itemTitle} - Site: ${site.name} - Chisel`;

    return <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ContentEdit item={item}
                   itemsHistory={content.itemsHistory}
                   onClose={closeItem}
                   gotoItem={gotoItem}
                   gotoList={gotoList}
                   addItem={addItem}
                   updateItem={updateItem}
                   publishItem={publishItem}
                   archiveItem={archiveItem}
                   restoreItem={restoreItem}
                   discardItem={discardItem}
                   deleteItem={deleteItem}
                   addMediaItem={addMediaItem}
                   updateMediaItem={updateMediaItem}
                   removeMediaItem={removeMediaItem}
                   lastItem={lastItem}
                   showAlert={showAlert}
                   showModal={showModal}
                   showNotification={showNotification}
                   alertShowing={nav.alertShowing}
                   closeNotification={closeNotification}
                   isEditable={models.role != ROLE_DEVELOPER} />
    </>;
  }
}

function mapStateToProps(state) {
  return {
    models:   state.models,
    content:  state.content,
    nav:      state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    contentActions: bindActionCreators({setCurrentItem, addItem, updateItem, publishItem, discardItem,
      archiveItem, restoreItem, deleteItem, pushToItemsHistory, popFromItemsHistory}, dispatch),
    mediaActions:   bindActionCreators({addMediaItem, updateMediaItem, removeMediaItem}, dispatch),
    navActions:     bindActionCreators({showModal, showAlert, showNotification, closeNotification}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentEditContainer);
