import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './app.sss';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import MainArea from 'containers/MainArea/MainArea';
import Sign from 'containers/Sign/Sign';
import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import ModelModal from '../components/modals/ModelModal/ModelModal';
import AlertModal from '../components/modals/AlertModal/AlertModal';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  render() {
    const {user, initialize} = this.props;

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
              /// <ModelModal />
              /// <AlertModal title="Something new" description="Maybe error :(" buttonText="Submit" />
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
    initialize: state.initialize,
    user:       state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
