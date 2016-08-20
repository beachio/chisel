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
import {closeAlert, closeModal, MODAL_TYPE_FIELD} from 'ducks/nav';
import {updateField} from 'ducks/models';

import styles from './app.sss';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  render() {
    const {nav, user} = this.props;
    const {closeAlert, closeModal} = this.props.navActions;
    const {updateField} = this.props.modelActions;

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
              nav.modalShowing && nav.modalType == MODAL_TYPE_FIELD &&
                <FieldModal params={nav.modalParams}
                            onClose={closeModal}
                            updateField={updateField} />
            }
            {
              nav.alertShowing &&
                <AlertModal params={nav.alertParams} onClose={closeAlert} />
            }
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
            <Sign authError={user.authError} />
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
    modelActions: bindActionCreators({updateField}, dispatch),
    navActions: bindActionCreators({closeAlert, closeModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
