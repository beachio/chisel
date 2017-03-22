import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import MainArea from 'containers/MainArea/MainArea';
import Sign from 'containers/Sign/Sign';
import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import FieldModal from 'components/modals/FieldModal/FieldModal';
import MediaModal from 'components/modals/MediaModal/MediaModal';
import WysiwygModal from 'components/modals/WysiwygModal/WysiwygModal';
import ReferenceModal from 'components/modals/ReferenceModal/ReferenceModal';
import AlertModal from 'components/modals/AlertModal/AlertModal';
import {closeAlert, closeModal, MODAL_TYPE_FIELD, MODAL_TYPE_MEDIA, MODAL_TYPE_REFERENCE, MODAL_TYPE_WYSIWYG} from 'ducks/nav';
import {addField, updateField} from 'ducks/models';

import styles from './app.sss';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  render() {
    const {nav, user} = this.props;
    const {closeAlert, closeModal} = this.props.navActions;
    const {addField, updateField} = this.props.modelActions;
  
    let getModal = () => {
      if (nav.alertShowing)
        return <AlertModal params={nav.alertParams} onClose={closeAlert}/>;
    
      if (!nav.modalShowing)
        return null;
    
      switch (nav.modalType) {
        case MODAL_TYPE_FIELD:
          return <FieldModal params={nav.modalParams}
                             onClose={closeModal}
                             addField={addField}
                             updateField={updateField}/>;
      
        case MODAL_TYPE_MEDIA:
          return <MediaModal params={nav.modalParams}
                             onClose={closeModal}/>;
      
        case MODAL_TYPE_REFERENCE:
          return <ReferenceModal params={nav.modalParams}
                                 onClose={closeModal}/>;
      
        case MODAL_TYPE_WYSIWYG:
          return <WysiwygModal params={nav.modalParams}
                               onClose={closeModal}/>;
      
      }
    };
    
    let res = (
      <div styleName="wrapper">
        {this.props.children}
        {
          user.fetchingRequest &&
            <SiteLoader />
        }
        {getModal()}
      </div>
    );
    
    if (!user.localStorageReady)
      res = <SiteLoader />;
    
    return res;
  }
}

function mapStateToProps(state) {
  return {
    nav:  state.nav,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelActions: bindActionCreators({addField, updateField}, dispatch),
    navActions: bindActionCreators({closeAlert, closeModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
