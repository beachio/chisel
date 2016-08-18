import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import MainArea from 'containers/MainArea/MainArea';
import Sign from 'containers/Sign/Sign';
import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import {closeAlert} from 'ducks/nav';
import ModelModal from 'components/modals/ModelModal/ModelModal';
import AlertModal from 'components/modals/AlertModal/AlertModal';

import styles from './app.sss';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  render() {
    const {nav, user} = this.props;
    const {closeAlert} = this.props.navActions;

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
              nav.alertShowing &&
                <AlertModal alertParams={nav.alertParams} onClose={closeAlert} />
            }
            {
              false &&
                <ModelModal />
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
    navActions: bindActionCreators({closeAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
