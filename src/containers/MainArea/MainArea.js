import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import ModelsList from 'components/mainArea/models/ModelsList/ModelsList';
import ContentList from 'components/mainArea/content/ContentList/ContentList';
import ContentEdit from 'components/mainArea/content/ContentEdit/ContentEdit';
import Sharing from 'components/mainArea/sharing/Sharing';
import Model from 'components/mainArea/models/Model/Model';
import {addCollaboration, updateCollaboration, deleteCollaboration, addModel, setCurrentModel, updateModel, deleteModel, addField, removeField} from 'ducks/models';
import {addItem, updateItem, setCurrentItem, deleteItem} from 'ducks/content';
import {addMediaItem, updateMediaItem, removeMediaItem} from 'ducks/media';
import {PAGE_MODELS, PAGE_CONTENT, PAGE_API, PAGE_SETTINGS, PAGE_SHARING, showAlert, closeModel, closeContentItem, showModal} from 'ducks/nav';
import InlineSVG from 'svg-inline-react';

import styles from './MainArea.sss';


@CSSModules(styles, {allowMultiple: true})
export class MainArea extends Component  {
  render() {
    const {models, content, nav} = this.props;
    const {addCollaboration, updateCollaboration, deleteCollaboration, addModel, setCurrentModel, updateModel, deleteModel, addField, removeField} = this.props.modelsActions;
    const {addItem, updateItem, setCurrentItem} = this.props.contentActions;
    const {showAlert, closeModel, closeContentItem, showModal} = this.props.navActions;
    const {addMediaItem, updateMediaItem, removeMediaItem} = this.props.mediaActions;

    let isEditable = models.isOwner || models.isAdmin;

    let Area = (
      <div styleName="start-working">
        <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
        Add new site to start working
        <div styleName="hint">Find "Add new site" button at sidebar</div>
      </div>
    );
    switch (nav.openedPage) {
      case PAGE_MODELS:
        if (models.currentSite)
          Area = (
            <ModelsList models={models.currentSite.models}
                        setCurrentModel={setCurrentModel}
                        addModel={addModel}
                        deleteModel={deleteModel}
                        showAlert={showAlert}
                        alertShowing={nav.alertShowing}
                        isEditable={isEditable} />
          );
        
        if (nav.openedModel)
          Area = (
            <Model model={models.currentModel}
                   onClose={closeModel}
                   updateModel={updateModel}
                   addField={addField}
                   removeField={removeField}
                   showAlert={showAlert}
                   showModal={showModal}
                   modalShowing={nav.modalShowing}
                   alertShowing={nav.alertShowing}
                   isEditable={isEditable} />
          );

        break;

      case PAGE_CONTENT:
        if (models.currentSite)
          Area = (
            <ContentList items={content.items}
                         models={models.currentSite.models}
                         setCurrentItem={setCurrentItem}
                         addItem={addItem}
                         deleteItem={deleteItem}
                         showAlert={showAlert}
                         alertShowing={nav.alertShowing}
                         isEditable={isEditable}/>
          );
  
        if (nav.openedContentItem)
          Area = (
            <ContentEdit item={content.currentItem}
                         onClose={closeContentItem}
                         updateItem={updateItem}
                         addMediaItem={addMediaItem}
                         updateMediaItem={updateMediaItem}
                         removeMediaItem={removeMediaItem}
                         showModal={showModal}
                         isEditable={isEditable} />
          );

        break;

      case PAGE_SHARING:
        Area = (
          <Sharing collaborations={models.currentSite.collaborations}
                   owner={models.currentSite.owner}
                   addCollaboration={addCollaboration}
                   updateCollaboration={updateCollaboration}
                   deleteCollaboration={deleteCollaboration}
                   showAlert={showAlert}
                   alertShowing={nav.alertShowing}
                   isEditable={models.isOwner} />
        );
    }

    return (
      <div styleName="mainArea">
        {Area}
      </div>
    );
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
    modelsActions:  bindActionCreators({addCollaboration, updateCollaboration, deleteCollaboration, addModel, setCurrentModel, updateModel, deleteModel, addField, removeField}, dispatch),
    contentActions: bindActionCreators({addItem, updateItem, setCurrentItem, deleteItem}, dispatch),
    navActions:     bindActionCreators({showAlert, closeModel, closeContentItem, showModal}, dispatch),
    mediaActions:   bindActionCreators({addMediaItem, updateMediaItem, removeMediaItem}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainArea);
