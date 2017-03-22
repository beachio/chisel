import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {push} from 'react-router-redux';

import ContentEdit from 'components/mainArea/content/ContentEdit/ContentEdit';
import {ROLE_DEVELOPER} from 'models/UserData';
import {updateItem, setCurrentItem} from 'ducks/content';
import {addMediaItem, updateMediaItem, removeMediaItem} from 'ducks/media';
import {showModal} from 'ducks/nav';
import {USERSPACE_URL, SITE_URL, CONTENT_URL, ITEM_URL} from 'middleware/routing';

import styles from './ContentEditContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ContentEditContainer extends Component  {
  render() {
    const {models, content} = this.props;
    const {updateItem, setCurrentItem} = this.props.contentActions;
    const {showModal} = this.props.navActions;
    const {addMediaItem, updateMediaItem, removeMediaItem} = this.props.mediaActions;
    const {push} = this.props.routerActions;
    
    let curSite = models.currentSite;
    let closeItem = () => {
      let siteNameId = curSite.nameId;
      push(`${USERSPACE_URL}${SITE_URL}${siteNameId}${CONTENT_URL}`);
    };
    let gotoItem = item => {
      let siteNameId = curSite.nameId;
      let modelNameId = item.model.nameId;
      let itemId = item.origin.id;
      push(`${USERSPACE_URL}${SITE_URL}${siteNameId}${CONTENT_URL}${ITEM_URL}${modelNameId}~${itemId}`);
    };
    
    return <ContentEdit item={content.currentItem}
                        onClose={closeItem}
                        gotoItem={gotoItem}
                        updateItem={updateItem}
                        addMediaItem={addMediaItem}
                        updateMediaItem={updateMediaItem}
                        removeMediaItem={removeMediaItem}
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
    contentActions: bindActionCreators({updateItem, setCurrentItem}, dispatch),
    mediaActions:   bindActionCreators({addMediaItem, updateMediaItem, removeMediaItem}, dispatch),
    navActions:     bindActionCreators({showModal}, dispatch),
    routerActions:  bindActionCreators({push}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentEditContainer);
