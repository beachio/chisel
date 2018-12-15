import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import CSSTransition from 'react-transition-group/CSSTransition';

import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import SiteCreationModal from 'components/modals/SiteCreationModal/SiteCreationModal';
import FieldModal from 'components/modals/FieldModal/FieldModal';
import MediaModal from 'components/modals/MediaModal/MediaModal';
import WysiwygModal from 'components/modals/WysiwygModal/WysiwygModal';
import MarkdownModal from 'components/modals/MarkdownModal/MarkdownModal';
import ReferenceModal from 'components/modals/ReferenceModal/ReferenceModal';
import ModelChooseModal from 'components/modals/ModelChooseModal/ModelChooseModal';
import CollabRoleModal from 'components/modals/CollabRoleModal/CollabRoleModal';
import PaymentMethods from "components/modals/PaymentMethods/PaymentMethods";
import AlertModal, {ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';
import {
  closeAlert, closeModal, MODAL_TYPE_SITE, MODAL_TYPE_FIELD, MODAL_TYPE_MEDIA, MODAL_TYPE_REFERENCE, MODAL_TYPE_WYSIWYG,
  MODAL_TYPE_MODEL_CHOOSE, MODAL_TYPE_MARKDOWN, MODAL_TYPE_ROLE, MODAL_TYPE_PAYMENT_METHODS
} from 'ducks/nav';
import {addSite, addField, updateField} from 'ducks/models';
import {addSource, updateSubscription} from 'ducks/pay';
import {update as updateUser} from 'ducks/user';

import styles from './app.sss';



@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  lastModal = <span></span>;

  render() {
    const {nav, user, content, models, serverStatus, pay} = this.props;
    const {closeAlert, closeModal} = this.props.navActions;
    const {addSite, addField, updateField} = this.props.modelActions;
    const {addSource, updateSubscription} = this.props.payActions;
    const {updateUser} = this.props.userActions;
  
    const getAlarm = () => {
      if (serverStatus.problemA && !serverStatus.problemB)
        return (
          <div styleName="alarm">
            There is a problem with server. Please wait...
          </div>
        );
      return null;
    };

    const getModal = () => {
      if (nav.alertShowing)
        return <AlertModal params={nav.alertParams} onClose={closeAlert}/>;
    
      if (!nav.modalShowing) {
        if (!serverStatus.problemB || !nav.initEnded)
          return null;

        let params = {
          type: ALERT_TYPE_ALERT,
          title: `Service problem`,
          description: "There are problems with our service or internet connection. You should try later.",
          btnText: 'Reload page'
        };
        return <AlertModal params={params}
                           onClose={() => window.location = '/'}/>;
      }
    
      switch (nav.modalType) {
        case MODAL_TYPE_SITE:
          return <SiteCreationModal params={nav.modalParams}
                                    templates={models.templates}
                                    addSite={addSite}
                                    onClose={closeModal} />;
                             
        case MODAL_TYPE_FIELD:
          return <FieldModal params={nav.modalParams}
                             onClose={closeModal}
                             addField={addField}
                             models={models.currentSite.models}
                             updateField={updateField}/>;
      
        case MODAL_TYPE_MEDIA:
          return <MediaModal params={nav.modalParams}
                             onClose={closeModal}/>;
      
        case MODAL_TYPE_REFERENCE:
          return <ReferenceModal params={nav.modalParams}
                                 currentSite={models.currentSite}
                                 contentItems={content.items}
                                 onClose={closeModal}/>;
      
        case MODAL_TYPE_WYSIWYG:
          return <WysiwygModal params={nav.modalParams}
                               onClose={closeModal}/>;

        case MODAL_TYPE_MARKDOWN:
          return <MarkdownModal params={nav.modalParams}
                                onClose={closeModal}/>;
  
        case MODAL_TYPE_MODEL_CHOOSE:
          return <ModelChooseModal params={nav.modalParams}
                                   models={models.currentSite.models}
                                   onClose={closeModal}/>;
      
        case MODAL_TYPE_ROLE:
          return <CollabRoleModal params={nav.modalParams}
                                  onClose={closeModal} />;
  
        case MODAL_TYPE_PAYMENT_METHODS:
          return <PaymentMethods params={nav.modalParams}
                                 userData={user.userData}
                                 addSource={addSource}
                                 updateSubscription={updateSubscription}
                                 updateUser={updateUser}
                                 stripeData={pay.stripeData}
                                 onClose={closeModal} />;
      }
    };

    //костыльно чот, блин
    const trans = {
      enter: styles['modal-enter'],
      enterActive: styles['modal-enter-active'],
      exit: styles['modal-exit'],
      exitActive: styles['modal-exit-active']
    };

    const modal = getModal();
    if (modal)
      this.lastModal = modal;
    
    const showModalLoader =
      (user.pending || user.authorized && !nav.initEnded) &&
      !serverStatus.problemB;

    let res = (
      <div styleName="wrapper">
        {this.props.children}
        {
          showModalLoader &&
            <SiteLoader />
        }
        <CSSTransition in={!!modal}
                       timeout={300}
                       classNames={trans}
                       mountOnEnter={true}
                       unmountOnExit={true}>
          {this.lastModal}
        </CSSTransition>
        {getAlarm()}
      </div>
    );
    
    if (!user.localStorageReady)
      res = <SiteLoader />;
    
    return res;
  }
}

function mapStateToProps(state) {
  return {
    content:      state.content,
    models:       state.models,
    nav:          state.nav,
    pay:          state.pay,
    serverStatus: state.serverStatus,
    user:         state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelActions: bindActionCreators({addSite, addField, updateField}, dispatch),
    navActions: bindActionCreators({closeAlert, closeModal}, dispatch),
    payActions: bindActionCreators({addSource, updateSubscription}, dispatch),
    userActions: bindActionCreators({updateUser}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
