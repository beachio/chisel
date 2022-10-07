import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Route, Routes, Navigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import CSSModules from 'react-css-modules';
import CSSTransition from 'react-transition-group/CSSTransition';

import Sign from 'containers/Sign/Sign';
import EmailVerify from 'containers/LinksEmail/EmailVerify/EmailVerify';
import PasswordSet from 'containers/LinksEmail/PasswordSet/PasswordSet';
import InvalidLink from 'containers/LinksEmail/InvalidLink/InvalidLink';
import MainArea from 'containers/MainArea/MainArea';
import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import SiteCreationModal from 'components/modals/SiteCreationModal/SiteCreationModal';
import FieldModal from 'components/modals/FieldModal/FieldModal';
import MediaModal from 'components/modals/MediaModal/MediaModal';
import WysiwygModal from 'components/modals/WysiwygModal/WysiwygModal';
import MarkdownModal from 'components/modals/MarkdownModal/MarkdownModal';
import ReferenceModal from 'components/modals/ReferenceModal/ReferenceModal';
import ModelChooseModal from 'components/modals/ModelChooseModal/ModelChooseModal';
import CollabRoleModal from 'components/modals/CollabRoleModal/CollabRoleModal';
import AlertModal, {ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';
import {
  URL_USERSPACE, URL_INVALID_LINK, URL_EMAIL_VERIFY, URL_PASSWORD_SET, URL_PASSWORD_SUCCESS, URL_SIGN,
  changeLocation, closeAlert, closeModal, MODAL_TYPE_SITE, MODAL_TYPE_FIELD, MODAL_TYPE_MEDIA, MODAL_TYPE_REFERENCE,
  MODAL_TYPE_WYSIWYG, MODAL_TYPE_MODEL_CHOOSE, MODAL_TYPE_MARKDOWN, MODAL_TYPE_ROLE
} from 'ducks/nav';
import {addSite, addField, updateField} from 'ducks/models';
import {withRouter} from 'utils/routing';

import styles from './app.sss';



@CSSModules(styles, {allowMultiple: true})
class App extends Component {
  lastModal = <span></span>;

  constructor(props) {
    super(props);

    const {navActions, router} = props;
    const {location, navigate, navigationType, params} = router;
    navActions.changeLocation(location, navigate, navigationType, params);
  }

  componentDidUpdate(prevProps) {
    const {navActions, router} = this.props;
    const {location, navigate, navigationType, params} = router;
    if (location !== prevProps.router.location) {
      navActions.changeLocation(location, navigate, navigationType, params);
    }
  }

  render() {
    const {nav, user, content, models, media} = this.props;
    const {closeAlert, closeModal} = this.props.navActions;
    const {addSite, addField, updateField} = this.props.modelActions;

    const getAlarm = () => {
      if (nav.serverProblemA && !nav.serverProblemB)
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
        if (!nav.serverProblemB || !nav.initEnded)
          return null;

        let params = {
          type: ALERT_TYPE_ALERT,
          title: `Service problem`,
          description: "There are problems with our service or internet connection. You should try later.",
          confirmLabel: 'Reload page'
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
                             mediaItems={media.items}
                             currentSite={models.currentSite}
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
      !nav.serverProblemB;

    let res = (
      <div styleName="wrapper">
        <Helmet>
          <title>Chisel</title>
        </Helmet>

        <>
          {user.authorized ?
            <Routes>
              <Route path={`${URL_USERSPACE}/*`}  element={<MainArea />} />
              <Route path="*"                     element={<Navigate to={URL_USERSPACE} replace />} />
            </Routes>
          :
            <Routes>
              <Route path={URL_SIGN}              element={<Sign />} />
              <Route path={URL_EMAIL_VERIFY}      element={<EmailVerify />} />
              <Route path={URL_PASSWORD_SUCCESS}  element={<PasswordSet />} />
              <Route path={URL_PASSWORD_SET}      element={<PasswordSet />} />
              <Route path={URL_INVALID_LINK}      element={<InvalidLink />} />
              <Route path="*"                     element={<Navigate to={URL_SIGN} replace />} />
            </Routes>
          }
        </>

        {showModalLoader &&
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
    content:  state.content,
    media:    state.media,
    models:   state.models,
    nav:      state.nav,
    user:     state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelActions: bindActionCreators({addSite, addField, updateField}, dispatch),
    navActions: bindActionCreators({changeLocation, closeAlert, closeModal}, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
