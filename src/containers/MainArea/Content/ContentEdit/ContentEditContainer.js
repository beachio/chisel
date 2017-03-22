import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import ContentEdit from 'components/mainArea/content/ContentEdit/ContentEdit';
import {ROLE_DEVELOPER} from 'models/UserData';
import {updateItem, setCurrentItem} from 'ducks/content';
import {addMediaItem, updateMediaItem, removeMediaItem} from 'ducks/media';
import {showModal} from 'ducks/nav';

import styles from './ContentEditContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ContentEditContainer extends Component  {
  render() {
    const {models, content} = this.props;
    const {updateItem, setCurrentItem} = this.props.contentActions;
    const {closeContentItem, showModal} = this.props.navActions;
    const {addMediaItem, updateMediaItem, removeMediaItem} = this.props.mediaActions;
    
    let curSite = models.currentSite;
    
    return <ContentEdit item={content.currentItem}
                        onClose={closeContentItem}
                        setCurrentItem={setCurrentItem}
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
    navActions:     bindActionCreators({showModal}, dispatch),
    mediaActions:   bindActionCreators({addMediaItem, updateMediaItem, removeMediaItem}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentEditContainer);
