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
import AlertModal from 'components/modals/AlertModal/AlertModal';
import {closeModal, MODAL_TYPE_ALERT, MODAL_TYPE_FIELD} from 'ducks/nav';

import styles from './app.sss';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  render() {
    const {nav, user} = this.props;
    const {closeModal} = this.props.navActions;

    let Page = (
      <div>
        <SiteLoader />
      </div>
    );

    if (user.localStorageReady) {
      if (user.authorized) {
        Page = (
          <div>
            {
              nav.modalShowing && nav.modalType == MODAL_TYPE_ALERT &&
                <AlertModal params={nav.modalParams} onClose={closeModal} />
            }
            {
              nav.modalShowing && nav.modalType == MODAL_TYPE_FIELD &&
                <FieldModal params={nav.modalParams} onClose={closeModal} />
            }
            <FieldModal params={nav.modalParams} onClose={closeModal} />
            <Header />
            <div styleName="wrapper-inner">
              <Sidebar />
              <MainArea />
            </div>
          </div>
        );
      } else {
        Page = (
          <div className="container">
            <Sign />
            {
              user.fetchingRequest &&
                <SiteLoader />
            }
          </div>
        );
      }
    }

    return (
      <div styleName="wrapper">
        {Page}
      </div>
    );
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
    navActions: bindActionCreators({closeModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
